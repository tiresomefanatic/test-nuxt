<!-- pages/login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <h1 class="login-title">Admin Access</h1>

        <!-- Password protection layer -->
        <div v-if="!isPasswordVerified" class="password-section">
          <p class="login-description">Enter password to access login</p>
          <div class="password-input-wrapper">
            <input
              v-model="password"
              type="password"
              class="password-input"
              placeholder="Enter password"
              @keyup.enter="verifyPassword"
            />
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
          </div>
          <button @click="verifyPassword" class="verify-button">
            Continue
          </button>
        </div>

        <!-- GitHub login section - shown only after password verification -->
        <div v-else class="github-section">
          <p class="login-description">Sign in with GitHub to continue</p>
          <button @click="handleLogin" class="login-button">
            <svg class="github-icon" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGithubAuth } from "~/composables/useGithubAuth";

const { initiateLogin } = useGithubAuth();
const password = ref("");
const isPasswordVerified = ref(false);
const passwordError = ref("");

// Static password - in a real application, this should be stored securely
const ADMIN_PASSWORD = "echo2024"; // You can change this to any password you want

const verifyPassword = () => {
  if (password.value === ADMIN_PASSWORD) {
    isPasswordVerified.value = true;
    passwordError.value = "";
  } else {
    passwordError.value = "Incorrect password";
    password.value = "";
  }
};

const handleLogin = async () => {
  if (!isPasswordVerified.value) return;

  try {
    await initiateLogin();
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>

<style scoped>
.login-page {
  @apply min-h-screen flex items-center justify-center bg-gray-50;
}

.login-container {
  @apply max-w-md w-full mx-auto p-6;
}

.login-content {
  @apply bg-white py-8 px-4 shadow-md rounded-lg sm:px-10;
}

.login-title {
  @apply text-center text-3xl font-bold text-gray-900 mb-4;
}

.login-description {
  @apply text-center text-sm text-gray-600 mb-8;
}

.password-section {
  @apply space-y-4;
}

.password-input-wrapper {
  @apply space-y-2;
}

.password-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.error-message {
  @apply text-sm text-red-600;
}

.verify-button {
  @apply w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.github-section {
  @apply space-y-4;
}

.login-button {
  @apply w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500;
}

.github-icon {
  @apply mr-2;
}
</style>
