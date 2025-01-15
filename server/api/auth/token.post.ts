// server/api/auth/token.post.ts
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Validate request
  if (!body.code) {
    console.error('Missing code in request body');
    throw createError({
      statusCode: 400,
      message: "Authorization code is required",
    });
  }

  try {
    console.log('Exchanging code for token with GitHub...');
    // Exchange code for access token with GitHub
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code: body.code,
        }),
      }
    );

    const data = await response.json();
    console.log('GitHub response received:', { hasError: !!data.error });

    // Handle GitHub API errors
    if (data.error) {
      console.error('GitHub API error:', data);
      throw createError({
        statusCode: 400,
        message: data.error_description || data.error,
      });
    }

    console.log('Token exchange successful');
    // Return the access token
    return {
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch (error: any) {
    console.error("Token exchange error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to exchange token",
    });
  }
});
