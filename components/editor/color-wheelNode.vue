# components/editor/color-wheelNode.vue
<template>
  <BaseNodeComponent :deleteNode="deleteNode">
    <ContentColorWheel
      :sportColor="node.attrs.sportColor"
      :cruiserColor="node.attrs.cruiserColor"
      :urbanColor="node.attrs.urbanColor"
      :offroadColor="node.attrs.offroadColor"
      @click:section="updateSection"
    />
  </BaseNodeComponent>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";
import BaseNodeComponent from "./BaseNodeComponent.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
  },
  deleteNode: {
    type: Function,
    required: true,
  },
});

const updateSection = (section: string, color: string) => {
  props.updateAttributes({
    [`${section}Color`]: color,
  });
};
</script>
