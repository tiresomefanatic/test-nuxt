import { ref } from 'vue';
import { D as klona, R as parse, S as getRequestHeader, n as destr, T as isEqual, a as setCookie, U as getCookie, V as deleteCookie } from '../nitro/nitro.mjs';
import { d as useRoute, b as useNuxtApp } from './server.mjs';

function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? undefined : _a.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a2, _b;
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  (_a2 = opts.filter) != null ? _a2 : opts.filter = (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== undefined) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== undefined && delay <= 0;
  const cookieValue = klona(hasExpired ? undefined : (_b = cookies[name]) != null ? _b : (_a = opts.default) == null ? undefined : _a.call(opts));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies || (nuxtApp._cookies = {});
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== undefined) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== undefined) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useContentPreview = () => {
  const getPreviewToken = () => {
    return useCookie("previewToken").value || false || undefined;
  };
  const setPreviewToken = (token) => {
    useCookie("previewToken").value = token;
    useRoute().query.preview = token || "";
  };
  const isEnabled = () => {
    const query = useRoute().query;
    if (Object.prototype.hasOwnProperty.call(query, "preview") && !query.preview) {
      return false;
    }
    if (query.preview || useCookie("previewToken").value) {
      return true;
    }
    return false;
  };
  return {
    isEnabled,
    getPreviewToken,
    setPreviewToken
  };
};

export { useContentPreview as a, useRequestEvent as u };
//# sourceMappingURL=preview-B1t3pASZ.mjs.map
