<!-- components/Header.vue -->
<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo Section -->
      <div class="logo">
        <NuxtLink to="/" class="logo-link">ECHO</NuxtLink>
        <span class="logo-dot"></span>
      </div>

      <!-- Navigation -->
      <nav class="nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.disabled ? '' : item.path"
          class="nav-link"
          :class="{
            active: $route.path.startsWith(item.path),
            disabled: item.disabled,
          }"
          @click.prevent="!item.disabled && navigateTo(item.path)"
        >
          {{ item.label }}
          <span v-if="item.disabled" class="lock-icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </NuxtLink>
      </nav>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Search -->
        <div class="search">
          <input
            type="text"
            placeholder="Search"
            class="search-input"
            disabled
          />
          <span class="search-divider">/</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, navigateTo } from "#app";

interface NavItem {
  label: string;
  path: string;
  disabled: boolean;
}

const navItems: NavItem[] = [
  { label: "Design", path: "/design", disabled: false },
  { label: "Develop", path: "/develop", disabled: true },
  { label: "Contribute", path: "/contribute", disabled: true },
  { label: "Options", path: "/options", disabled: true },
];

const route = useRoute();
</script>

<style scoped>
/* Keep all existing styles but remove user profile related styles */
.header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200;
}

.header-content {
  @apply container mx-auto px-8 h-16 flex items-center justify-between;
}

.logo {
  @apply flex items-center space-x-2;
}

.logo-link {
  @apply text-xl font-bold text-gray-900;
}

.logo-dot {
  @apply w-2 h-2 bg-orange-500 rounded-full;
}

.nav {
  @apply flex-1 flex justify-center space-x-8;
}

.nav-link {
  @apply text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2;
}

.nav-link.active {
  @apply text-gray-900;
}

.nav-link.disabled {
  @apply cursor-not-allowed opacity-50 hover:text-gray-600;
}

.lock-icon {
  @apply inline-flex items-center;
}

.header-right {
  @apply flex items-center space-x-4;
}

.search {
  @apply relative flex items-center;
}

.search-input {
  @apply w-64 pl-4 pr-8 py-2 bg-transparent border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.search-divider {
  @apply absolute right-3 text-gray-400;
}

@media (max-width: 768px) {
  .nav {
    @apply hidden;
  }

  .search {
    @apply hidden;
  }

  .header-content {
    @apply px-4;
  }
}
</style>
