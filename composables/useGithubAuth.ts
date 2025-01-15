// composables/useGithubAuth.ts
import { ref } from "vue";

// Define interface for the GitHub API response
interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

// Define interface for API error response
interface ApiError {
  message: string;
  statusCode: number;
}

export const useGithubAuth = () => {
  const isAuthenticated = ref(false);
  const accessToken = ref<string | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const config = useRuntimeConfig();

  const initialize = () => {
    if (!process.client) return;

    const token = localStorage.getItem("github_token");
    if (token) {
      accessToken.value = token;
      isAuthenticated.value = true;
    }
  };

  const initiateLogin = () => {
    if (!process.client) return;

    try {
      const clientId = config.public.githubClientId;
      console.log("Client ID available:", !!clientId);

      if (!clientId) {
        throw new Error("GitHub client ID is not configured");
      }

      // Generate and store state
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem("github_oauth_state", state);

      // Always use port 3000 for local development
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? config.public.siteUrl
          : "http://localhost:3000";
      console.log("Base URL:", baseUrl);

      // Construct callback URL
      const callbackUrl = new URL("/auth/callback", baseUrl).toString();
      console.log("Callback URL:", callbackUrl);

      // Construct GitHub authorization URL
      const githubUrl = new URL("https://github.com/login/oauth/authorize");
      githubUrl.searchParams.set("client_id", clientId);
      githubUrl.searchParams.set("redirect_uri", callbackUrl);
      githubUrl.searchParams.set("scope", "repo user");
      githubUrl.searchParams.set("state", state);
      githubUrl.searchParams.set("response_type", "code");

      console.log("Redirecting to GitHub:", githubUrl.toString());

      // Redirect to GitHub
      window.location.href = githubUrl.toString();
    } catch (err) {
      console.error("Error initiating GitHub login:", err);
      error.value =
        err instanceof Error ? err.message : "Failed to initiate GitHub login";
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Verify state
      const savedState = localStorage.getItem("github_oauth_state");
      if (!savedState || savedState !== state) {
        throw new Error("Invalid state parameter");
      }

      // Exchange code for token
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to exchange code for token"
        );
      }

      const data = await response.json();
      localStorage.setItem("github_access_token", data.access_token);
      accessToken.value = data.access_token;
      isAuthenticated.value = true;

      // Clear OAuth state
      localStorage.removeItem("github_oauth_state");
    } catch (err) {
      console.error("Error handling callback:", err);
      error.value =
        err instanceof Error ? err.message : "Authentication failed";
      isAuthenticated.value = false;
      accessToken.value = null;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    if (!process.client) return;

    localStorage.removeItem("github_access_token");
    accessToken.value = null;
    isAuthenticated.value = false;
  };

  // Initialize on mount if in client
  if (process.client) {
    initialize();
  }

  return {
    isAuthenticated,
    accessToken,
    error,
    loading,
    initiateLogin,
    handleCallback,
    logout,
  };
};
