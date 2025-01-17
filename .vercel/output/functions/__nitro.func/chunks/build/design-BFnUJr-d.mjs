import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import DesignSidebar from './DesignSidebar-CHQYSUW0.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'vue-router';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = {
  __name: "design",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "design-layout" }, _attrs))} data-v-2a10b014>`);
      _push(ssrRenderComponent(DesignSidebar, null, null, _parent));
      _push(`<div class="design-content" data-v-2a10b014>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/design.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const design = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2a10b014"]]);

export { design as default };
//# sourceMappingURL=design-BFnUJr-d.mjs.map
