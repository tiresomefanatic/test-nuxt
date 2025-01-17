import { useSSRContext, defineComponent, unref, mergeProps, withCtx, createVNode, renderSlot } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { NodeViewWrapper } from '@tiptap/vue-3';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'pinia';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseNodeComponent",
  __ssrInlineRender: true,
  props: {
    deleteNode: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NodeViewWrapper), mergeProps({ class: "editor-node-wrapper" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="node-controls" data-v-593e23f1${_scopeId}><button class="delete-btn" data-v-593e23f1${_scopeId}>Delete</button></div>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", { class: "node-controls" }, [
                createVNode("button", {
                  onClick: _ctx.deleteNode,
                  class: "delete-btn"
                }, "Delete", 8, ["onClick"])
              ]),
              renderSlot(_ctx.$slots, "default", {}, undefined, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/BaseNodeComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const BaseNodeComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-593e23f1"]]);

export { BaseNodeComponent as default };
//# sourceMappingURL=BaseNodeComponent-B88i5Ldc.mjs.map
