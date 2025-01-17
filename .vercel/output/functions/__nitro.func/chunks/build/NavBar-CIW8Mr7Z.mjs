import { ref, defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "NavBar",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = ["Vehicle", "Accessories", "Product", "Packaging"];
    const selectedCategory = ref("Vehicle");
    defineComponent({
      name: "NavBar"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "mb-8" }, _attrs))}><ul class="flex justify-center items-center space-x-8"><!--[-->`);
      ssrRenderList(categories, (category, index) => {
        _push(`<li><button class="${ssrRenderClass([[
          selectedCategory.value === category ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
        ], "px-8 py-3 rounded-full transition-colors duration-200"])}">${ssrInterpolate(category)}</button></li>`);
      });
      _push(`<!--]--></ul><div class="mt-4 h-0.5 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500"></div></nav>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content/NavBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=NavBar-CIW8Mr7Z.mjs.map
