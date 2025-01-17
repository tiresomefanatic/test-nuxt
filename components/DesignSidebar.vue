# DesignSidebar.vue
<template>
  <div class="sidebar-wrapper">
    <!-- Mobile menu button -->
    <button
      class="mobile-menu-btn"
      :class="{ 'is-open': isOpen }"
      @click="toggleMobileMenu"
      aria-label="Toggle menu"
    >
      <div class="hamburger-lines">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </div>
    </button>

    <!-- Sidebar -->
    <aside class="design-sidebar" :class="{ 'is-mobile-open': isOpen }">
      <!-- Mobile header -->
      <div class="mobile-header">
        <span class="mobile-title">Menu</span>
        <button class="close-btn" @click="toggleMobileMenu">
          <span class="close-icon">×</span>
        </button>
      </div>

      <nav class="design-nav">
        <div class="nav-content">
          <!-- Foundation Section -->
          <div class="nav-group">
            <div
              class="nav-group-header main-item"
              @click="toggleSection('foundation')"
            >
              Foundation
              <span
                class="chevron"
                :class="{ rotated: !isCollapsed.foundation }"
                >›</span
              >
            </div>
            <div
              class="nav-group-content"
              :class="{ collapsed: isCollapsed.foundation }"
            >
              <NuxtLink
                to="/design/foundation/logo"
                class="nav-item sub-item"
                @click="closeMobileMenu"
                >Logo</NuxtLink
              >
              <NuxtLink
                to="/design/foundation/color"
                class="nav-item sub-item"
                @click="closeMobileMenu"
                >Color</NuxtLink
              >
              <NuxtLink
                to="/design/foundation/typography"
                class="nav-item sub-item"
                @click="closeMobileMenu"
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
                @click="closeMobileMenu"
                >Creative Spectrum</NuxtLink
              >
              <NuxtLink
                to="/design/product/case-studies"
                class="nav-item sub-item"
                @click="closeMobileMenu"
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
              <NuxtLink
                to="/design/space/introduction"
                class="nav-item sub-item"
                @click="closeMobileMenu"
                >Introduction</NuxtLink
              >
              <NuxtLink
                to="/design/space/mood"
                class="nav-item sub-item"
                @click="closeMobileMenu"
                >Mood</NuxtLink
              >
              <NuxtLink
                to="/design/space/form"
                class="nav-item sub-item"
                @click="closeMobileMenu"
                >Form</NuxtLink
              >
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Mobile overlay -->
    <div
      class="mobile-overlay"
      :class="{ 'is-visible': isOpen }"
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isOpen = ref(false);
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

function toggleMobileMenu() {
  isOpen.value = !isOpen.value;
  document.body.style.overflow = isOpen.value ? "hidden" : "";
}

function closeMobileMenu() {
  isOpen.value = false;
  document.body.style.overflow = "";
}
</script>

<style scoped>
.sidebar-wrapper {
  position: relative;
  height: 100%;
}

.design-sidebar {
  height: 100%;
  width: 280px;
  background: white;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-overflow-scrolling: touch;
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
  border-radius: 8px;
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
  width: 16px;
  height: 16px;
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

/* Mobile styles */
.mobile-menu-btn {
  display: none;
}

.mobile-header {
  display: none;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    position: fixed;
    top: 32px;
    left: 1rem;
    width: 48px;
    height: 48px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    z-index: 1002;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s ease;
  }

  .mobile-menu-btn:hover {
    background-color: #f8f9fa;
  }

  .hamburger-lines {
    width: 24px;
    height: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .hamburger-line {
    width: 100%;
    height: 2px;
    background-color: #333;
    transition: all 0.3s ease;
  }

  .mobile-menu-btn.is-open .hamburger-line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .mobile-menu-btn.is-open .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-btn.is-open .hamburger-line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .design-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1001;
    background: white;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .design-sidebar.is-mobile-open {
    transform: translateX(0);
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .mobile-title {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .close-btn {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-icon {
    font-size: 24px;
    color: #666;
    line-height: 1;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1000;
  }

  .mobile-overlay.is-visible {
    opacity: 1;
    visibility: visible;
  }

  .nav-content {
    height: calc(100vh - 64px);
    overflow-y: auto;
    margin: 0;
    border-radius: 0;
  }

  /* iOS-specific fixes */
  @supports (-webkit-touch-callout: none) {
    .design-sidebar {
      height: -webkit-fill-available;
    }

    .nav-content {
      height: calc(100vh - 64px - env(safe-area-inset-bottom));
    }
  }
}
</style>
