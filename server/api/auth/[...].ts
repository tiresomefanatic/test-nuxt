import { defineEventHandler, parseCookies, setCookie, createError } from "h3";
import { Octokit } from "@octokit/rest";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = event.path;

  console.log("Auth handler called with path:", path);

  // Handle login
  if (path.endsWith("/api/auth/login")) {
    console.log("Handling login...");
    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${config.github.clientId}&` +
      `scope=repo user&` +
      `redirect_uri=${encodeURIComponent(
        (process.env.NODE_ENV === "production"
          ? "https://tiresomefanatic.github.io/test-nuxt"
          : "http://localhost:3000") + "/api/auth/callback"
      )}`;

    return sendRedirect(event, authUrl);
  }

  // Handle callback
  if (path.includes("/api/auth/callback")) {
    console.log("Handling callback...");
    const query = getQuery(event);
    console.log("Callback query:", query);
    const code = query.code as string;

    if (!code) {
      console.error("No code provided in callback");
      throw createError({
        statusCode: 400,
        message: "No code provided",
      });
    }

    try {
      console.log("Exchanging code for token...");
      // Exchange code for token
      const tokenResponse = await fetch(
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
            code,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      console.log(
        "Token response received:",
        tokenData.access_token ? "Token present" : "No token"
      );

      if (!tokenData.access_token) {
        throw createError({
          statusCode: 401,
          message: "Failed to get access token",
        });
      }

      // Return token in response
      const baseUrl = process.env.NODE_ENV === "production" ? "/test-nuxt" : "";
      return sendRedirect(event, `${baseUrl}/?token=${tokenData.access_token}`);
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to authenticate with GitHub",
      });
    }
  }

  // Handle logout
  if (path.endsWith("/api/auth/logout")) {
    setCookie(event, "github_token", "", {
      maxAge: 0,
      httpOnly: true,
    });
    return sendRedirect(event, "/");
  }

  throw createError({
    statusCode: 404,
    message: "Not found",
  });
});
