import { d as defineEventHandler, u as useRuntimeConfig, g as getQuery, s as sendRedirect } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';

const callback_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  console.log("Received callback with query:", query);
  if (!query.code || !query.state) {
    console.error("Missing required parameters:", { code: !!query.code, state: !!query.state });
    return sendRedirect(event, "/?error=missing_params");
  }
  try {
    const baseUrl = config.public.siteUrl || "http://localhost:3009";
    console.log("Base URL:", baseUrl);
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("code", query.code);
    redirectUrl.searchParams.set("state", query.state);
    const finalRedirectUrl = redirectUrl.toString();
    console.log("Redirecting to:", finalRedirectUrl);
    return sendRedirect(event, finalRedirectUrl);
  } catch (error) {
    console.error("Error in callback handler:", error);
    return sendRedirect(event, "/?error=callback_error");
  }
});

export { callback_get as default };
//# sourceMappingURL=callback.get.mjs.map
