import { defineComponent, ref, provide, createElementBlock, useSSRContext, computed, watch, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useGithub } from './useGithub-Bxs3U9ia.mjs';
import { _ as _export_sfc, b as useToast } from './server.mjs';
import { defineStore } from 'pinia';
import '@octokit/rest';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'unhead';
import '@unhead/shared';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? undefined : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useHtmlContentStore = defineStore("html-content", () => {
  const contentCache = ref(/* @__PURE__ */ new Map());
  const getContentKey = (path, branch) => `${branch}:${path}`;
  const setContent = (path, content, sha, branch) => {
    const key = getContentKey(path, branch);
    contentCache.value.set(key, {
      content,
      path,
      lastModified: Date.now(),
      sha,
      branch
    });
  };
  const getContent = (path, branch) => {
    const key = getContentKey(path, branch);
    return contentCache.value.get(key);
  };
  const getContentBySha = (sha, branch) => {
    return Array.from(contentCache.value.values()).find(
      (entry) => entry.sha === sha && entry.branch === branch
    );
  };
  const clearContent = (path, branch) => {
    const key = getContentKey(path, branch);
    contentCache.value.delete(key);
  };
  const clearBranchContent = (branch) => {
    for (const [key, entry] of contentCache.value.entries()) {
      if (entry.branch === branch) {
        contentCache.value.delete(key);
      }
    }
  };
  const clearAllContent = () => {
    contentCache.value.clear();
  };
  return {
    setContent,
    getContent,
    getContentBySha,
    clearContent,
    clearBranchContent,
    clearAllContent
  };
});
const useContent = (path) => {
  const htmlStore = useHtmlContentStore();
  const { getRawContent, saveFileContent, currentBranch } = useGithub();
  const loading = ref(false);
  const error = ref(null);
  const currentSha = ref(null);
  const content = computed(() => {
    const cached = htmlStore.getContent(path, currentBranch.value);
    return (cached == null ? undefined : cached.content) || "";
  });
  const checkGitHubContent = async () => {
    var _a;
    try {
      const response = await fetch(
        `https://api.github.com/repos/tiresomefanatic/test-nuxt/commits?path=${path}&sha=${currentBranch.value}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch commit info");
      }
      const commits = await response.json();
      const latestSha = (_a = commits[0]) == null ? void 0 : _a.sha;
      const needsFetch = !currentSha.value || currentSha.value !== latestSha;
      if (needsFetch) {
        const cachedContent = htmlStore.getContentBySha(
          latestSha,
          currentBranch.value
        );
        if (cachedContent) {
          console.log(
            "Found cached content for SHA:",
            latestSha,
            "in branch:",
            currentBranch.value
          );
          return cachedContent.content;
        }
        console.log(
          "Fetching new content for SHA:",
          latestSha,
          "in branch:",
          currentBranch.value
        );
        const newContent = await getRawContent(
          "tiresomefanatic",
          "test-nuxt",
          path,
          currentBranch.value
        );
        htmlStore.setContent(path, newContent, latestSha, currentBranch.value);
        currentSha.value = latestSha;
        return newContent;
      }
      return content.value;
    } catch (error2) {
      console.error("Error checking GitHub content:", error2);
      return content.value;
    }
  };
  const fetchContent = async (force = false) => {
    loading.value = true;
    error.value = null;
    try {
      if (force) {
        const newContent = await checkGitHubContent();
        return newContent;
      }
      if (content.value) {
        checkGitHubContent();
        return content.value;
      }
      return await checkGitHubContent();
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const saveContent = async (newContent) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await saveFileContent(
        "tiresomefanatic",
        "test-nuxt",
        path,
        newContent,
        `Update ${path}`,
        currentBranch.value
      );
      if (result && result.commit && result.commit.sha) {
        htmlStore.setContent(
          path,
          newContent,
          result.commit.sha,
          currentBranch.value
        );
        currentSha.value = result.commit.sha;
      }
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };
  return {
    content,
    loading,
    error,
    fetchContent,
    saveContent
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[...slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { isLoggedIn, currentBranch } = useGithub();
    const { showToast } = useToast();
    const loading = ref(false);
    const isEditing = ref(false);
    const editorContent = ref("");
    ref(null);
    const showEditor = ref(false);
    const route = useRoute();
    const slug = route.params.slug || [];
    const path = Array.isArray(slug) ? slug.join("/") : slug;
    computed(() => path !== "");
    const contentPath = computed(() => {
      if (!path) return "content/index.md";
      return `content/${path}.md`;
    });
    const {
      content,
      loading: contentLoading,
      error,
      fetchContent,
      saveContent
    } = useContent(contentPath.value);
    const loadContent = async (force = false) => {
      loading.value = true;
      try {
        const newContent = await fetchContent(force);
        editorContent.value = newContent;
      } catch (error2) {
        console.error("Content loading error:", error2);
        showToast({
          title: "Error",
          message: `Failed to load content from branch: ${currentBranch.value}`,
          type: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    watch(isEditing, async (newValue, oldValue) => {
      if (newValue && !oldValue) {
        await loadContent(true);
      } else if (!newValue && oldValue) {
        showEditor.value = false;
      }
    });
    watch(currentBranch, async (newBranch, oldBranch) => {
      if (newBranch !== oldBranch) {
        console.log(
          `Branch changed from ${oldBranch} to ${newBranch}, reloading content...`
        );
        await loadContent(true);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-wrapper" }, _attrs))} data-v-e9b11c31>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e9b11c31"]]);

export { ____slug_ as default };
//# sourceMappingURL=_...slug_-B2g2eGjN.mjs.map
