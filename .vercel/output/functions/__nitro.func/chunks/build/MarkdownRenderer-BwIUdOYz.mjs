import _sfc_main$1 from './ContentRenderer-CHxg6O31.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './ContentRendererMarkdown-Cy-esoUZ.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'property-information';
import './node-BZyc0_pG.mjs';
import './preview-C8EdG0-L.mjs';
import './server.mjs';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MarkdownRenderer",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const components = {
      style: "style",
      p: "p",
      div: "div",
      img: "img"
      // Add other components as needed
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentRenderer = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "markdown-renderer" }, _attrs))}>`);
      if (__props.data) {
        _push(ssrRenderComponent(_component_ContentRenderer, {
          value: __props.data,
          components
        }, {
          empty: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p${_scopeId}>No content found.</p>`);
            } else {
              return [
                createVNode("p", null, "No content found.")
              ];
            }
          }),
          _: 1
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MarkdownRenderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=MarkdownRenderer-BwIUdOYz.mjs.map
