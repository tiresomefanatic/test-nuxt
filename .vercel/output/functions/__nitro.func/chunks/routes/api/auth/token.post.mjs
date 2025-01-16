import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';

const token_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  if (!body.code) {
    console.error("Missing code in request body");
    throw createError({
      statusCode: 400,
      message: "Authorization code is required"
    });
  }
  try {
    console.log("Exchanging code for token with GitHub...");
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code: body.code
        })
      }
    );
    const data = await response.json();
    console.log("GitHub response received:", { hasError: !!data.error });
    if (data.error) {
      console.error("GitHub API error:", data);
      throw createError({
        statusCode: 400,
        message: data.error_description || data.error
      });
    }
    console.log("Token exchange successful");
    return {
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope
    };
  } catch (error) {
    console.error("Token exchange error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to exchange token"
    });
  }
});

export { token_post as default };
//# sourceMappingURL=token.post.mjs.map
