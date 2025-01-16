import { unref, mergeProps, withCtx, createVNode, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { NodeViewWrapper } from '@tiptap/vue-3';
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

const _sfc_main = {
  __name: "ColorWheelNode",
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
    const updateSection = (section) => {
      const colorMap = {
        sport: "#FF6B6B",
        cruiser: "#4ECDC4",
        urban: "#FFD93D",
        offroad: "#95E1D3"
      };
      props.updateAttributes({
        [`${section}Color`]: colorMap[section]
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(NodeViewWrapper), mergeProps({ class: "color-wheel-node" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="wheel-controls" data-v-99dc10ca${_scopeId}><button class="delete-btn" data-v-99dc10ca${_scopeId}>Delete</button></div><div class="wheel-wrapper relative w-96 h-96 mx-auto" data-v-99dc10ca${_scopeId}><div class="transform transition-transform duration-300 hover:-translate-y-2" data-v-99dc10ca${_scopeId}><svg viewBox="0 0 100 100" class="w-full h-full" data-v-99dc10ca${_scopeId}><path d="M50,50 L100,50 A50,50 0 0,0 50,0 Z"${ssrRenderAttr("fill", __props.node.attrs.sportColor || "#FF6B6B")} class="transition-transform origin-center hover:scale-105" data-v-99dc10ca${_scopeId}></path><text x="75" y="25" font-size="6" fill="white" text-anchor="middle" transform="rotate(45, 75, 25)" data-v-99dc10ca${_scopeId}> SPORT </text><path d="M50,50 L50,0 A50,50 0 0,0 0,50 Z"${ssrRenderAttr("fill", __props.node.attrs.cruiserColor || "#4ECDC4")} class="transition-transform origin-center hover:scale-105" data-v-99dc10ca${_scopeId}></path><text x="25" y="25" font-size="6" fill="white" text-anchor="middle" transform="rotate(-45, 25, 25)" data-v-99dc10ca${_scopeId}> CRUISER </text><path d="M50,50 L0,50 A50,50 0 0,0 50,100 Z"${ssrRenderAttr("fill", __props.node.attrs.urbanColor || "#FFD93D")} class="transition-transform origin-center hover:scale-105" data-v-99dc10ca${_scopeId}></path><text x="25" y="75" font-size="6" fill="white" text-anchor="middle" transform="rotate(45, 25, 75)" data-v-99dc10ca${_scopeId}> URBAN </text><path d="M50,50 L50,100 A50,50 0 0,0 100,50 Z"${ssrRenderAttr("fill", __props.node.attrs.offroadColor || "#95E1D3")} class="transition-transform origin-center hover:scale-105" data-v-99dc10ca${_scopeId}></path><text x="75" y="75" font-size="6" fill="white" text-anchor="middle" transform="rotate(-45, 75, 75)" data-v-99dc10ca${_scopeId}> OFFROAD </text><circle cx="50" cy="50" r="10" fill="white" data-v-99dc10ca${_scopeId}></circle></svg></div></div>`);
          } else {
            return [
              createVNode("div", { class: "wheel-controls" }, [
                createVNode("button", {
                  onClick: __props.deleteNode,
                  class: "delete-btn"
                }, "Delete", 8, ["onClick"])
              ]),
              createVNode("div", { class: "wheel-wrapper relative w-96 h-96 mx-auto" }, [
                createVNode("div", { class: "transform transition-transform duration-300 hover:-translate-y-2" }, [
                  (openBlock(), createBlock("svg", {
                    viewBox: "0 0 100 100",
                    class: "w-full h-full"
                  }, [
                    createVNode("path", {
                      d: "M50,50 L100,50 A50,50 0 0,0 50,0 Z",
                      fill: __props.node.attrs.sportColor || "#FF6B6B",
                      class: "transition-transform origin-center hover:scale-105",
                      onClick: ($event) => updateSection("sport")
                    }, null, 8, ["fill", "onClick"]),
                    createVNode("text", {
                      x: "75",
                      y: "25",
                      "font-size": "6",
                      fill: "white",
                      "text-anchor": "middle",
                      transform: "rotate(45, 75, 25)"
                    }, " SPORT "),
                    createVNode("path", {
                      d: "M50,50 L50,0 A50,50 0 0,0 0,50 Z",
                      fill: __props.node.attrs.cruiserColor || "#4ECDC4",
                      class: "transition-transform origin-center hover:scale-105",
                      onClick: ($event) => updateSection("cruiser")
                    }, null, 8, ["fill", "onClick"]),
                    createVNode("text", {
                      x: "25",
                      y: "25",
                      "font-size": "6",
                      fill: "white",
                      "text-anchor": "middle",
                      transform: "rotate(-45, 25, 25)"
                    }, " CRUISER "),
                    createVNode("path", {
                      d: "M50,50 L0,50 A50,50 0 0,0 50,100 Z",
                      fill: __props.node.attrs.urbanColor || "#FFD93D",
                      class: "transition-transform origin-center hover:scale-105",
                      onClick: ($event) => updateSection("urban")
                    }, null, 8, ["fill", "onClick"]),
                    createVNode("text", {
                      x: "25",
                      y: "75",
                      "font-size": "6",
                      fill: "white",
                      "text-anchor": "middle",
                      transform: "rotate(45, 25, 75)"
                    }, " URBAN "),
                    createVNode("path", {
                      d: "M50,50 L50,100 A50,50 0 0,0 100,50 Z",
                      fill: __props.node.attrs.offroadColor || "#95E1D3",
                      class: "transition-transform origin-center hover:scale-105",
                      onClick: ($event) => updateSection("offroad")
                    }, null, 8, ["fill", "onClick"]),
                    createVNode("text", {
                      x: "75",
                      y: "75",
                      "font-size": "6",
                      fill: "white",
                      "text-anchor": "middle",
                      transform: "rotate(-45, 75, 75)"
                    }, " OFFROAD "),
                    createVNode("circle", {
                      cx: "50",
                      cy: "50",
                      r: "10",
                      fill: "white"
                    })
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ColorWheelNode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const ColorWheelNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-99dc10ca"]]);

export { ColorWheelNode as default };
//# sourceMappingURL=ColorWheelNode-LlNQdGPh.mjs.map
