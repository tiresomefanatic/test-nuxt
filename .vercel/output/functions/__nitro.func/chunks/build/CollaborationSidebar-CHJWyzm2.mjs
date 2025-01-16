import { useSSRContext, defineComponent, ref, computed, watch, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useGithub } from './useGithub-Bxs3U9ia.mjs';
import { u as useToast } from './useToast-CuZrFQgt.mjs';
import CreatePullRequest from './CreatePullRequest-oLrf17ey.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CollaborationSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const open = ref(false);
    const activeTab = ref("branches");
    const loading = ref(false);
    const pullRequests = ref([]);
    const commits = ref([]);
    const currentConflict = ref(null);
    const selectedVersion = ref("current");
    const newBranchName = ref("");
    const showCreatePR = ref(false);
    const { showToast } = useToast();
    const {
      getPullRequests,
      getCommits,
      resolveConflict: resolveGitHubConflict,
      fetchBranches,
      createBranch,
      switchBranch,
      currentBranch,
      branches,
      isLoggedIn
    } = useGithub();
    const tabs = computed(() => [
      {
        id: "prs",
        label: "Pull Requests",
        count: pullRequests.value.length
      },
      {
        id: "history",
        label: "History",
        count: commits.value.length
      },
      {
        id: "conflicts",
        label: "Conflicts",
        count: pullRequests.value.filter((pr) => pr.mergeable === false).length
      },
      {
        id: "branches",
        label: "Branches",
        count: branches.value.length
      }
    ]);
    watch(isLoggedIn, async (newValue) => {
      if (newValue) {
        await fetchBranches();
      }
    });
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    };
    const getPRStatus = (pr) => {
      if (pr.mergeable === false) return "Has Conflicts";
      if (pr.mergeable === true) return "Ready to Merge";
      return "Checking";
    };
    const handlePRCreated = async () => {
      showCreatePR.value = false;
      await loadPullRequests();
    };
    const loadPullRequests = async () => {
      loading.value = true;
      try {
        const prs = await getPullRequests();
        pullRequests.value = prs;
      } catch (error) {
        console.error("Error loading pull requests:", error);
        showToast("Failed to load pull requests", "error");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["collaboration-sidebar", { open: open.value }]
      }, _attrs))} data-v-47ebfc09><button class="toggle-button" data-v-47ebfc09><svg class="icon" viewBox="0 0 24 24" width="24" height="24" data-v-47ebfc09>`);
      if (!open.value) {
        _push(`<path fill="currentColor" d="M21 15.75c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM21 12c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM3.75 9h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z" data-v-47ebfc09></path>`);
      } else {
        _push(`<path fill="currentColor" d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.75.75 0 1 1 1.06 1.06L13.06 12l5.22 5.22a.75.75 0 1 1-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 0 1-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z" data-v-47ebfc09></path>`);
      }
      _push(`</svg></button><div class="sidebar-content" data-v-47ebfc09><div class="tabs" data-v-47ebfc09><!--[-->`);
      ssrRenderList(tabs.value, (tab) => {
        _push(`<button class="${ssrRenderClass([{ active: activeTab.value === tab.id }, "tab-button"])}" data-v-47ebfc09>${ssrInterpolate(tab.label)} `);
        if (tab.count) {
          _push(`<span class="count" data-v-47ebfc09>${ssrInterpolate(tab.count)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      if (activeTab.value === "prs") {
        _push(`<div class="tab-content" data-v-47ebfc09><div class="pr-actions-header" data-v-47ebfc09>`);
        if (!showCreatePR.value) {
          _push(`<button class="create-pr-button" data-v-47ebfc09> Create Pull Request </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (showCreatePR.value) {
          _push(ssrRenderComponent(CreatePullRequest, {
            branches: unref(branches),
            currentBranch: unref(currentBranch),
            onCreated: handlePRCreated,
            onCancel: ($event) => showCreatePR.value = false
          }, null, _parent));
        } else if (loading.value) {
          _push(`<div class="loading" data-v-47ebfc09><div class="spinner" data-v-47ebfc09></div> Loading pull requests... </div>`);
        } else if (pullRequests.value.length === 0) {
          _push(`<div class="empty-state" data-v-47ebfc09> No open pull requests </div>`);
        } else {
          _push(`<div class="pr-list" data-v-47ebfc09><!--[-->`);
          ssrRenderList(pullRequests.value, (pr) => {
            _push(`<div class="${ssrRenderClass([{ "has-conflicts": pr.mergeable === false }, "pr-item"])}" data-v-47ebfc09><div class="pr-header" data-v-47ebfc09><span class="pr-number" data-v-47ebfc09>#${ssrInterpolate(pr.number)}</span><span class="pr-title" data-v-47ebfc09>${ssrInterpolate(pr.title)}</span></div><div class="pr-meta" data-v-47ebfc09><span class="pr-author" data-v-47ebfc09><img${ssrRenderAttr("src", pr.user.avatar_url)}${ssrRenderAttr("alt", pr.user.login)} class="author-avatar" data-v-47ebfc09> ${ssrInterpolate(pr.user.login)}</span><span class="${ssrRenderClass([pr.mergeable_state, "pr-status"])}" data-v-47ebfc09>${ssrInterpolate(getPRStatus(pr))}</span></div><div class="pr-actions" data-v-47ebfc09><button class="action-button view" data-v-47ebfc09> View on GitHub </button>`);
            if (pr.mergeable === false) {
              _push(`<button class="action-button resolve" data-v-47ebfc09> Resolve Conflicts </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "history") {
        _push(`<div class="tab-content" data-v-47ebfc09>`);
        if (loading.value) {
          _push(`<div class="loading" data-v-47ebfc09><div class="spinner" data-v-47ebfc09></div> Loading commit history... </div>`);
        } else if (commits.value.length === 0) {
          _push(`<div class="empty-state" data-v-47ebfc09> No commit history available </div>`);
        } else {
          _push(`<div class="commit-list" data-v-47ebfc09><!--[-->`);
          ssrRenderList(commits.value, (commit) => {
            var _a;
            _push(`<div class="commit-item" data-v-47ebfc09><div class="commit-header" data-v-47ebfc09><span class="commit-message" data-v-47ebfc09>${ssrInterpolate(commit.commit.message)}</span></div><div class="commit-meta" data-v-47ebfc09><span class="commit-author" data-v-47ebfc09>`);
            if ((_a = commit.author) == null ? undefined : _a.avatar_url) {
              _push(`<img${ssrRenderAttr("src", commit.author.avatar_url)}${ssrRenderAttr("alt", commit.commit.author.name)} class="author-avatar" data-v-47ebfc09>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${ssrInterpolate(commit.commit.author.name)}</span><span class="commit-date" data-v-47ebfc09>${ssrInterpolate(formatDate(commit.commit.author.date))}</span></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "conflicts") {
        _push(`<div class="tab-content" data-v-47ebfc09>`);
        if (currentConflict.value) {
          _push(`<div class="conflict-resolver" data-v-47ebfc09><div class="conflict-header" data-v-47ebfc09><h3 data-v-47ebfc09>Resolve Conflicts</h3><p data-v-47ebfc09>Choose which changes to keep for ${ssrInterpolate(currentConflict.value.file)}</p></div><div class="conflict-diff" data-v-47ebfc09><div class="diff-header" data-v-47ebfc09><button class="${ssrRenderClass([{ active: selectedVersion.value === "current" }, "diff-button"])}" data-v-47ebfc09> Current Changes </button><button class="${ssrRenderClass([{ active: selectedVersion.value === "incoming" }, "diff-button"])}" data-v-47ebfc09> Incoming Changes </button></div><div class="diff-content" data-v-47ebfc09>`);
          if (selectedVersion.value === "current") {
            _push(`<pre class="diff-view current" data-v-47ebfc09>                ${ssrInterpolate(currentConflict.value.current)}
              </pre>`);
          } else {
            _push(`<pre class="diff-view incoming" data-v-47ebfc09>                ${ssrInterpolate(currentConflict.value.incoming)}
              </pre>`);
          }
          _push(`</div></div><div class="conflict-actions" data-v-47ebfc09><button class="action-button cancel" data-v-47ebfc09> Cancel </button><button class="action-button resolve" data-v-47ebfc09> Accept ${ssrInterpolate(selectedVersion.value === "current" ? "Current" : "Incoming")} Changes </button></div></div>`);
        } else {
          _push(`<div class="empty-state" data-v-47ebfc09>No conflicts to resolve</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "branches") {
        _push(`<div class="tab-content" data-v-47ebfc09><div class="section" data-v-47ebfc09><h3 data-v-47ebfc09>Branch Management</h3>`);
        if (unref(isLoggedIn)) {
          _push(`<div class="branch-controls" data-v-47ebfc09><div class="branch-controls" data-v-47ebfc09><div class="current-branch" data-v-47ebfc09><span class="label" data-v-47ebfc09>Current Branch:</span><select${ssrRenderAttr("value", unref(currentBranch))} data-v-47ebfc09><!--[-->`);
          ssrRenderList(unref(branches), (branch) => {
            _push(`<option${ssrRenderAttr("value", branch)} data-v-47ebfc09>${ssrInterpolate(branch)}</option>`);
          });
          _push(`<!--]--></select></div><div class="new-branch" data-v-47ebfc09><input${ssrRenderAttr("value", newBranchName.value)} placeholder="New branch name" data-v-47ebfc09><button class="create-branch"${ssrIncludeBooleanAttr(!newBranchName.value || loading.value) ? " disabled" : ""} data-v-47ebfc09> Create Branch </button></div></div></div>`);
        } else {
          _push(`<div class="login-prompt" data-v-47ebfc09><p data-v-47ebfc09>Please log in to manage branches</p></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CollaborationSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const CollaborationSidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-47ebfc09"]]);

export { CollaborationSidebar as default };
//# sourceMappingURL=CollaborationSidebar-CHJWyzm2.mjs.map
