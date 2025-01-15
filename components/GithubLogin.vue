<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useGithubAuth } from "~/composables/useGithubAuth";
import { useToast } from "@/composables/useToast";

// Initialize our route and router for navigation handling
const route = useRoute();
const router = useRouter();

// Initialize our authentication and notification composables
const { showToast } = useToast();
const {
  isAuthenticated,
  error,
  loading,
  initiateLogin,
  handleCallback,
  logout,
} = useGithubAuth();

// Watch for authentication errors and display them to the user
// This helps provide immediate feedback when something goes wrong
watch(error, (newError) => {
  if (newError) {
    showToast({
      title: "Authentication Error",
      message: newError,
      type: "error",
    });
  }
});

// This function handles the initial GitHub OAuth callback
// It's called when GitHub redirects back to our application
const handleAuthCallback = async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;

  if (code && state) {
    try {
      // Attempt to exchange the code for an access token
      await handleCallback(code, state);

      showToast({
        title: "Success",
        message: "Successfully authenticated with GitHub",
        type: "success",
      });

      // Clean up the URL by removing the OAuth parameters
      await router.replace({
        path: route.path,
        query: {},
      });
    } catch (err) {
      console.error("Failed to handle authentication callback:", err);
      showToast({
        title: "Authentication Failed",
        message: "Unable to complete authentication. Please try again.",
        type: "error",
      });
    }
  }
};

// Handle login button click
const handleLogin = async () => {
  try {
    await initiateLogin();
  } catch (err) {
    console.error("Login error:", err);
    showToast({
      title: "Login Failed",
      message: "Unable to start login process. Please try again.",
      type: "error",
    });
  }
};

// Handle logout button click
const handleLogout = async () => {
  try {
    await logout();
    showToast({
      title: "Success",
      message: "Successfully logged out",
      type: "success",
    });
  } catch (err) {
    console.error("Logout error:", err);
    showToast({
      title: "Logout Failed",
      message: "Unable to complete logout. Please try again.",
      type: "error",
    });
  }
};

// Check for authentication callback when component mounts
onMounted(() => {
  const code = route.query.code as string;
  const state = route.query.state as string;

  if (code && state) {
    handleAuthCallback();
  }
});
</script>

<template>
  <div class="auth-container">
    <!-- Display any authentication errors -->
    <div v-if="error" class="error-message" role="alert" aria-live="polite">
      {{ error }}
    </div>

    <!-- Authentication status and actions -->
    <template v-if="!isAuthenticated">
      <UButton
        :loading="loading"
        :disabled="loading"
        @click="handleLogin"
        icon="i-simple-icons-github"
        size="lg"
        color="black"
        class="auth-button"
      >
        <span class="button-text">{{
          loading ? "Signing in..." : "Sign in with GitHub"
        }}</span>
      </UButton>

      <p class="auth-help">
        Sign in to edit and contribute to the documentation
      </p>
    </template>

    <template v-else>
      <div class="auth-success">
        <UIcon
          name="i-heroicons-check-circle"
          class="success-icon"
          aria-hidden="true"
        />
        <span>Successfully authenticated with GitHub</span>
      </div>

      <UButton
        @click="handleLogout"
        color="gray"
        variant="soft"
        class="logout-button"
        :disabled="loading"
      >
        Sign Out
      </UButton>
    </template>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  max-width: 24rem;
  margin: 0 auto;
}

.error-message {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgb(254 226 226);
  color: rgb(220 38 38);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
}

.auth-button {
  width: 100%;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button-text {
  margin-left: 0.5rem;
}

.auth-help {
  color: rgb(107 114 128);
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
}

.auth-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(5 150 105);
  font-weight: 500;
}

.success-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.logout-button {
  width: 100%;
  justify-content: center;
}

/* Accessibility improvements for focus states */
.auth-button:focus-visible,
.logout-button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Animation for status changes */
.auth-container :deep(.fade-enter-active),
.auth-container :deep(.fade-leave-active) {
  transition: opacity 0.3s ease;
}

.auth-container :deep(.fade-enter-from),
.auth-container :deep(.fade-leave-to) {
  opacity: 0;
}
</style>
