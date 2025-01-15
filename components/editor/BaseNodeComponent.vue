# components/editor/BaseNodeComponent.vue
<template>
  <node-view-wrapper class="editor-node-wrapper">
    <div class="node-controls">
      <button @click="deleteNode" class="delete-btn">Delete</button>
    </div>
    <slot></slot>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";

defineProps<{
  deleteNode: () => void;
}>();
</script>

<style scoped>
.editor-node-wrapper {
  margin: 2rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.node-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.delete-btn:hover {
  background: #cc0000;
}
</style>
