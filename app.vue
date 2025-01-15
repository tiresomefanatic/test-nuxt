# app.vue
<template>
  <div>
    <NuxtLayout>
      <Header />
      <main class="mt-24">
        <NuxtLoadingIndicator />
        <NuxtPage />
      </main>
    </NuxtLayout>
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
</script>

<style>
body {
  @apply bg-white;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
