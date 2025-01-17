import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import BaseNodeComponent from './BaseNodeComponent-B88i5Ldc.mjs';
import '@tiptap/vue-3';
import './server.mjs';
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
  __name: "color-wheelNode",
  __ssrInlineRender: true,
  props: {
    node: {
      type: Object,
      required: true
    },
    updateAttributes: {
      type: Function,
      required: true
    },
    deleteNode: {
      type: Function,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const updateSection = (section, color) => {
      props.updateAttributes({
        [`${section}Color`]: color
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentColorWheel = resolveComponent("ContentColorWheel");
      _push(ssrRenderComponent(BaseNodeComponent, mergeProps({ deleteNode: __props.deleteNode }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ContentColorWheel, {
              sportColor: __props.node.attrs.sportColor,
              cruiserColor: __props.node.attrs.cruiserColor,
              urbanColor: __props.node.attrs.urbanColor,
              offroadColor: __props.node.attrs.offroadColor,
              "onClick:section": updateSection
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ContentColorWheel, {
                sportColor: __props.node.attrs.sportColor,
                cruiserColor: __props.node.attrs.cruiserColor,
                urbanColor: __props.node.attrs.urbanColor,
                offroadColor: __props.node.attrs.offroadColor,
                "onClick:section": updateSection
              }, null, 8, ["sportColor", "cruiserColor", "urbanColor", "offroadColor"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/editor/color-wheelNode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=color-wheelNode-CIqUGI2P.mjs.map
