import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ColorWheel",
  __ssrInlineRender: true,
  setup(__props) {
    defineComponent({
      name: "ContentColorWheel"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wheel-wrapper relative w-96 h-96 mx-auto" }, _attrs))}><div class="transform transition-transform duration-300 hover:-translate-y-2"><svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50,50 L100,50 A50,50 0 0,0 50,0 Z" fill="#FF6B6B" class="transition-transform origin-center hover:scale-105"></path><text x="75" y="25" font-size="6" fill="white" text-anchor="middle" transform="rotate(45, 75, 25)"> SPORT </text><path d="M50,50 L50,0 A50,50 0 0,0 0,50 Z" fill="#4ECDC4" class="transition-transform origin-center hover:scale-105"></path><text x="25" y="25" font-size="6" fill="white" text-anchor="middle" transform="rotate(-45, 25, 25)"> CRUISER </text><path d="M50,50 L0,50 A50,50 0 0,0 50,100 Z" fill="#FFD93D" class="transition-transform origin-center hover:scale-105"></path><text x="25" y="75" font-size="6" fill="white" text-anchor="middle" transform="rotate(45, 25, 75)"> URBAN </text><path d="M50,50 L50,100 A50,50 0 0,0 100,50 Z" fill="#95E1D3" class="transition-transform origin-center hover:scale-105"></path><text x="75" y="75" font-size="6" fill="white" text-anchor="middle" transform="rotate(-45, 75, 75)"> OFFROAD </text><circle cx="50" cy="50" r="10" fill="white"></circle></svg></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/ColorWheel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=ColorWheel-CIeR78Y1.mjs.map
