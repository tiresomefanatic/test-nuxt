import { ref } from 'vue';

const useGithubAuth = () => {
  const isAuthenticated = ref(false);
  const accessToken = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const initiateLogin = () => {
    return;
  };
  const handleCallback = async (code, state) => {
    try {
      loading.value = true;
      error.value = null;
      const savedState = localStorage.getItem("github_oauth_state");
      if (!savedState || savedState !== state) {
        throw new Error("Invalid state parameter");
      }
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
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
      localStorage.removeItem("github_oauth_state");
    } catch (err) {
      console.error("Error handling callback:", err);
      error.value = err instanceof Error ? err.message : "Authentication failed";
      isAuthenticated.value = false;
      accessToken.value = null;
    } finally {
      loading.value = false;
    }
  };
  const logout = () => {
    return;
  };
  return {
    isAuthenticated,
    accessToken,
    error,
    loading,
    initiateLogin,
    handleCallback,
    logout
  };
};

export { useGithubAuth as u };
//# sourceMappingURL=useGithubAuth-DD3W0aHN.mjs.map
