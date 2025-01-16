import { useSSRContext, defineComponent, ref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "AddContentDialog",
  __ssrInlineRender: true,
  props: {
    onInsertComponent: { type: Function },
    onInsertSection: { type: Function }
  },
  setup(__props) {
    const isOpen = ref(false);
    const activeTab = ref("components");
    const components = [
      {
        id: "colorwheel",
        name: "Color Wheel",
        description: "Insert a color wheel component"
      }
    ];
    const sections = [
      {
        id: "split-with-image",
        name: "Split with Image",
        description: "Left title, right content with image and text"
      },
      {
        id: "split-with-list",
        name: "Split with List",
        description: "Left title, right content with image and bullet points"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dialog-wrapper" }, _attrs))} data-v-b53b07ac><button class="add-button" data-v-b53b07ac><span class="plus-icon" data-v-b53b07ac>+</span> Add </button>`);
      if (isOpen.value) {
        _push(`<div class="dialog-overlay" data-v-b53b07ac></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isOpen.value) {
        _push(`<div class="dialog" data-v-b53b07ac><div class="dialog-header" data-v-b53b07ac><h2 class="dialog-title" data-v-b53b07ac>Add Content</h2><button class="close-button" data-v-b53b07ac>\xD7</button></div><div class="tabs" data-v-b53b07ac><div class="tab-list" data-v-b53b07ac><button class="${ssrRenderClass([{ active: activeTab.value === "components" }, "tab-button"])}" data-v-b53b07ac> Components </button><button class="${ssrRenderClass([{ active: activeTab.value === "sections" }, "tab-button"])}" data-v-b53b07ac> Sections </button></div><div style="${ssrRenderStyle(activeTab.value === "components" ? null : { display: "none" })}" class="tab-content" data-v-b53b07ac><div class="content-grid" data-v-b53b07ac><!--[-->`);
        ssrRenderList(components, (component) => {
          _push(`<button class="content-button" data-v-b53b07ac><span class="content-title" data-v-b53b07ac>${ssrInterpolate(component.name)}</span><span class="content-description" data-v-b53b07ac>${ssrInterpolate(component.description)}</span></button>`);
        });
        _push(`<!--]--></div></div><div style="${ssrRenderStyle(activeTab.value === "sections" ? null : { display: "none" })}" class="tab-content" data-v-b53b07ac><div class="content-grid" data-v-b53b07ac><!--[-->`);
        ssrRenderList(sections, (section) => {
          _push(`<button class="content-button" data-v-b53b07ac><span class="content-title" data-v-b53b07ac>${ssrInterpolate(section.name)}</span><span class="content-description" data-v-b53b07ac>${ssrInterpolate(section.description)}</span></button>`);
        });
        _push(`<!--]--></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddContentDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const AddContentDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b53b07ac"]]);

export { AddContentDialog as default };
//# sourceMappingURL=AddContentDialog-_ja4enoB.mjs.map
