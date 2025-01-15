<template>
  <div class="content-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  unwrap: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.content-wrapper :deep(*) {
  white-space: normal;
}

.content-wrapper :deep(style) {
  display: none;
}
</style>
