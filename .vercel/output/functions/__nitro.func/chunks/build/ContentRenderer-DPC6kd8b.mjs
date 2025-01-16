import { defineComponent, watch, useSlots, h, useSSRContext } from 'vue';
import _sfc_main$1 from './ContentRendererMarkdown-C56DuM-P.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'property-information';
import './node-BZyc0_pG.mjs';
import 'vue/server-renderer';
import './preview-B1t3pASZ.mjs';
import './server.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';

const _sfc_main = defineComponent({
  name: "ContentRenderer",
  props: {
    /**
     * The document to render.
     */
    value: {
      type: Object,
      required: false,
      default: () => ({})
    },
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
      type: Boolean,
      default: false
    },
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props) {
    watch(
      () => props.excerpt,
      (newExcerpt) => {
        var _a, _b, _c;
        if (newExcerpt && !((_a = props.value) == null ? undefined : _a.excerpt)) {
          console.warn(`No excerpt found for document content/${(_b = props == null ? undefined : props.value) == null ? undefined : _b._path}.${(_c = props == null ? undefined : props.value) == null ? undefined : _c._extension}!`);
          console.warn("Make sure to use <!--more--> in your content if you want to use excerpt feature.");
        }
      },
      {
        immediate: true
      }
    );
  },
  /**
   * Content empty fallback
   * @slot empty
   */
  render(ctx) {
    var _a, _b;
    const slots = useSlots();
    const { value, excerpt, tag } = ctx;
    const markdownAST = excerpt ? value == null ? undefined : value.excerpt : value == null ? undefined : value.body;
    if (!((_a = markdownAST == null ? undefined : markdownAST.children) == null ? undefined : _a.length) && (slots == null ? undefined : slots.empty)) {
      return slots.empty({ value, excerpt, tag, ...this.$attrs });
    }
    if (slots == null ? undefined : slots.default) {
      return slots.default({ value, excerpt, tag, ...this.$attrs });
    }
    if ((markdownAST == null ? undefined : markdownAST.type) === "root" && ((_b = markdownAST == null ? undefined : markdownAST.children) == null ? undefined : _b.length)) {
      return h(
        _sfc_main$1,
        {
          value,
          excerpt,
          tag,
          ...this.$attrs
        }
      );
    }
    return h(
      "pre",
      null,
      JSON.stringify({ message: "You should use slots with <ContentRenderer>", value, excerpt, tag }, null, 2)
    );
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=ContentRenderer-DPC6kd8b.mjs.map
