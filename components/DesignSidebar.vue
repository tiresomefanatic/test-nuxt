<template>
  <aside class="design-sidebar">
    <nav class="design-nav">
      <div class="nav-content">
        <!-- Overview -->

        <!-- Foundation Section -->
        <div class="nav-group">
          <div
            class="nav-group-header main-item"
            @click="toggleSection('foundation')"
          >
            Foundation
            <span class="chevron" :class="{ rotated: !isCollapsed.foundation }"
              >›</span
            >
          </div>
          <div
            class="nav-group-content"
            :class="{ collapsed: isCollapsed.foundation }"
          >
            <NuxtLink to="/design/foundation/logo" class="nav-item sub-item"
              >Logo</NuxtLink
            >
            <NuxtLink to="/design/foundation/color" class="nav-item sub-item"
              >Color</NuxtLink
            >
            <NuxtLink
              to="/design/foundation/typography"
              class="nav-item sub-item"
              >Typography</NuxtLink
            >
            <div class="nav-item sub-item locked">
              Illustration
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
            <div class="nav-item sub-item locked">
              Icons
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
            <div class="nav-item sub-item locked">
              Layout
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
            <div class="nav-item sub-item locked">
              Imagery
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
            <div class="nav-item sub-item locked">
              Animation
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
            <div class="nav-item sub-item locked">
              Applications
              <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
            </div>
          </div>
        </div>

        <!-- Digital Section (Locked) -->
        <div class="nav-group">
          <div class="nav-group-header main-item locked">
            Digital
            <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
          </div>
        </div>

        <!-- Sound Section (Locked) -->
        <div class="nav-group">
          <div class="nav-group-header main-item locked">
            Sound
            <img src="/lock-icon.svg" alt="Locked" class="lock-icon" />
          </div>
        </div>

        <!-- Product Section -->
        <div class="nav-group">
          <div
            class="nav-group-header main-item"
            @click="toggleSection('product')"
          >
            Product
            <span class="chevron" :class="{ rotated: !isCollapsed.product }"
              >›</span
            >
          </div>
          <div
            class="nav-group-content"
            :class="{ collapsed: isCollapsed.product }"
          >
            <NuxtLink
              to="/design/product/creative-spectrum"
              class="nav-item sub-item"
              >Creative Spectrum</NuxtLink
            >
            <NuxtLink
              to="/design/product/case-studies"
              class="nav-item sub-item"
              >Case Studies</NuxtLink
            >
          </div>
        </div>

        <!-- Space Section -->
        <div class="nav-group">
          <div
            class="nav-group-header main-item"
            @click="toggleSection('space')"
          >
            Space
            <span class="chevron" :class="{ rotated: !isCollapsed.space }"
              >›</span
            >
          </div>
          <div
            class="nav-group-content"
            :class="{ collapsed: isCollapsed.space }"
          >
            <NuxtLink to="/design/space/introduction" class="nav-item sub-item"
              >Introduction</NuxtLink
            >
            <NuxtLink to="/design/space/mood" class="nav-item sub-item"
              >Mood</NuxtLink
            >
            <NuxtLink to="/design/space/form" class="nav-item sub-item"
              >Form</NuxtLink
            >
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isCollapsed = ref({
  foundation: false,
  digital: true,
  product: true,
  sound: true,
  space: true,
});

// Keep parent sections expanded based on current route
watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("/design/foundation/")) {
      isCollapsed.value.foundation = false;
    }
    if (newPath.includes("/design/product/")) {
      isCollapsed.value.product = false;
    }
    if (newPath.includes("/design/space/")) {
      isCollapsed.value.space = false;
    }
  },
  { immediate: true }
);

function toggleSection(section) {
  // Don't toggle if section is locked
  const lockedSections = ["digital", "sound"];
  if (!lockedSections.includes(section)) {
    isCollapsed.value[section] = !isCollapsed.value[section];
  }
}
</script>

<style scoped>
.design-sidebar {
  height: 100%;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.design-nav {
  height: 100%;
  padding: 1rem;
}

.nav-content {
  background: #f7f7f7;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-item {
  font-size: 1.125rem;
  font-weight: 400;
  color: #000000;
  padding: 0.5rem 0.75rem;
}

.sub-item {
  font-size: 1rem;
  font-weight: 400;
  color: #000000;
  padding: 0.5rem 0.75rem;
  margin-left: 0.5rem;
  line-height: 150%;
  letter-spacing: 0.15px;
}

.nav-item {
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.nav-item.active {
  background: #d8d8d8;
  font-weight: 500;
}

.nav-item.locked,
.nav-group-header.locked {
  color: #999;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-group-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  max-height: 500px;
  transition: max-height 0.3s ease-out;
}

.nav-group-content.collapsed {
  max-height: 0;
}

.chevron {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

.chevron.rotated {
  transform: rotate(90deg);
}

.lock-icon {
  color: #999;
  font-size: 1rem;
}

/* Hover states */
.nav-item:not(.locked):hover,
.nav-group-header:not(.locked):hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Active route state */
.router-link-active {
  font-weight: 500;
  background: rgba(0, 0, 0, 0.05);
}
</style>
