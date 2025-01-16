import { useSSRContext, defineComponent, ref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useGithubAuth } from './useGithubAuth-DD3W0aHN.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useGithubAuth();
    const password = ref("");
    const isPasswordVerified = ref(false);
    const passwordError = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-0729d1a1><div class="login-container" data-v-0729d1a1><div class="login-content" data-v-0729d1a1><h1 class="login-title" data-v-0729d1a1>Admin Access</h1>`);
      if (!isPasswordVerified.value) {
        _push(`<div class="password-section" data-v-0729d1a1><p class="login-description" data-v-0729d1a1>Enter password to access login</p><div class="password-input-wrapper" data-v-0729d1a1><input${ssrRenderAttr("value", password.value)} type="password" class="password-input" placeholder="Enter password" data-v-0729d1a1>`);
        if (passwordError.value) {
          _push(`<div class="error-message" data-v-0729d1a1>${ssrInterpolate(passwordError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="verify-button" data-v-0729d1a1> Continue </button></div>`);
      } else {
        _push(`<div class="github-section" data-v-0729d1a1><p class="login-description" data-v-0729d1a1>Sign in with GitHub to continue</p><button class="login-button" data-v-0729d1a1><svg class="github-icon" viewBox="0 0 24 24" width="24" height="24" data-v-0729d1a1><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" data-v-0729d1a1></path></svg> Sign in with GitHub </button></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0729d1a1"]]);

export { login as default };
//# sourceMappingURL=login-Dib2jbo6.mjs.map
