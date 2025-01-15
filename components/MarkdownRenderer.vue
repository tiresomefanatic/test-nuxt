<template>
  <div class="markdown-renderer">
    <ContentRenderer v-if="data" :value="data" :components="components">
      <template #empty>
        <p>No content found.</p>
      </template>
    </ContentRenderer>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const components = {
  style: "style",
  p: "p",
  div: "div",
  img: "img",
  // Add other components as needed
};
</script>

<style>
.markdown-renderer :deep(*) {
  white-space: normal;
}
</style>
