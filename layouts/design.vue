<template>
  <div class="design-layout">
    <DesignSidebar />
    <div class="design-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import DesignSidebar from "~/components/DesignSidebar.vue";
</script>

<style scoped>
.design-layout {
  display: flex;
  min-height: 100vh;
}

.design-content {
  flex: 1;
  padding: 2rem;
  margin-left: 280px; /* Same as sidebar width */
}

@media (max-width: 768px) {
  .design-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem; /* Space for mobile menu button */
  }
}
</style>
