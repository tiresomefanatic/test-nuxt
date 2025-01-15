// server/api/auth/callback.get.ts
import { defineEventHandler, getQuery, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  console.log('Received callback with query:', query);

  // Validate required parameters
  if (!query.code || !query.state) {
    console.error('Missing required parameters:', { code: !!query.code, state: !!query.state });
    return sendRedirect(event, "/?error=missing_params");
  }

  try {
    // Construct the base URL
    const baseUrl = config.public.siteUrl || 'http://localhost:3009';
    console.log('Base URL:', baseUrl);

    // Ensure we have a clean URL without double slashes
    const redirectUrl = new URL('/', baseUrl);
    redirectUrl.searchParams.set("code", query.code as string);
    redirectUrl.searchParams.set("state", query.state as string);

    const finalRedirectUrl = redirectUrl.toString();
    console.log('Redirecting to:', finalRedirectUrl);

    return sendRedirect(event, finalRedirectUrl);
  } catch (error) {
    console.error('Error in callback handler:', error);
    return sendRedirect(event, "/?error=callback_error");
  }
});
