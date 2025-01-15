<!-- components/ColorWheelNode.vue -->
<template>
  <node-view-wrapper class="color-wheel-node">
    <div class="wheel-controls">
      <button @click="deleteNode" class="delete-btn">Delete</button>
    </div>
    <div class="wheel-wrapper relative w-96 h-96 mx-auto">
      <div
        class="transform transition-transform duration-300 hover:-translate-y-2"
      >
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <!-- Sport Section - Red -->
          <path
            d="M50,50 L100,50 A50,50 0 0,0 50,0 Z"
            :fill="node.attrs.sportColor || '#FF6B6B'"
            class="transition-transform origin-center hover:scale-105"
            @click="updateSection('sport')"
          />
          <text
            x="75"
            y="25"
            font-size="6"
            fill="white"
            text-anchor="middle"
            transform="rotate(45, 75, 25)"
          >
            SPORT
          </text>

          <!-- Cruiser Section - Blue -->
          <path
            d="M50,50 L50,0 A50,50 0 0,0 0,50 Z"
            :fill="node.attrs.cruiserColor || '#4ECDC4'"
            class="transition-transform origin-center hover:scale-105"
            @click="updateSection('cruiser')"
          />
          <text
            x="25"
            y="25"
            font-size="6"
            fill="white"
            text-anchor="middle"
            transform="rotate(-45, 25, 25)"
          >
            CRUISER
          </text>

          <!-- Urban Section - Yellow -->
          <path
            d="M50,50 L0,50 A50,50 0 0,0 50,100 Z"
            :fill="node.attrs.urbanColor || '#FFD93D'"
            class="transition-transform origin-center hover:scale-105"
            @click="updateSection('urban')"
          />
          <text
            x="25"
            y="75"
            font-size="6"
            fill="white"
            text-anchor="middle"
            transform="rotate(45, 25, 75)"
          >
            URBAN
          </text>

          <!-- Offroad Section - Green -->
          <path
            d="M50,50 L50,100 A50,50 0 0,0 100,50 Z"
            :fill="node.attrs.offroadColor || '#95E1D3'"
            class="transition-transform origin-center hover:scale-105"
            @click="updateSection('offroad')"
          />
          <text
            x="75"
            y="75"
            font-size="6"
            fill="white"
            text-anchor="middle"
            transform="rotate(-45, 75, 75)"
          >
            OFFROAD
          </text>

          <!-- Center Circle -->
          <circle cx="50" cy="50" r="10" fill="white" />
        </svg>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";

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

const updateSection = (section) => {
  const colorMap = {
    sport: "#FF6B6B",
    cruiser: "#4ECDC4",
    urban: "#FFD93D",
    offroad: "#95E1D3",
  };

  props.updateAttributes({
    [`${section}Color`]: colorMap[section],
  });
};
</script>

<style scoped>
.color-wheel-node {
  margin: 2rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.wheel-controls {
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
