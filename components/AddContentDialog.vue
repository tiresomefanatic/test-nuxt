# AddContentDialog.vue
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  onInsertComponent: (componentId: string) => void;
  onInsertSection: (sectionId: string) => void;
}>();

const isOpen = ref(false);
const activeTab = ref("components");

const components = [
  {
    id: "colorwheel",
    name: "Color Wheel",
    description: "Insert a color wheel component",
  },
];

const sections = [
  {
    id: "split-with-image",
    name: "Split with Image",
    description: "Left title, right content with image and text",
  },
  {
    id: "split-with-list",
    name: "Split with List",
    description: "Left title, right content with image and bullet points",
  },
];

const handleInsertComponent = (componentId: string) => {
  props.onInsertComponent(componentId);
  isOpen.value = false;
};

const handleInsertSection = (sectionId: string) => {
  props.onInsertSection(sectionId);
  isOpen.value = false;
};

const toggleDialog = () => {
  isOpen.value = !isOpen.value;
};

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="dialog-wrapper">
    <!-- Add Button -->
    <button @click="toggleDialog" class="add-button">
      <span class="plus-icon">+</span>
      Add
    </button>

    <!-- Dialog Overlay -->
    <div v-if="isOpen" class="dialog-overlay" @click="toggleDialog"></div>

    <!-- Dialog Content -->
    <div v-if="isOpen" class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Add Content</h2>
        <button class="close-button" @click="toggleDialog">×</button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab-list">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'components' }"
            @click="setActiveTab('components')"
          >
            Components
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'sections' }"
            @click="setActiveTab('sections')"
          >
            Sections
          </button>
        </div>

        <!-- Components Tab Content -->
        <div v-show="activeTab === 'components'" class="tab-content">
          <div class="content-grid">
            <button
              v-for="component in components"
              :key="component.id"
              class="content-button"
              @click="handleInsertComponent(component.id)"
            >
              <span class="content-title">{{ component.name }}</span>
              <span class="content-description">{{
                component.description
              }}</span>
            </button>
          </div>
        </div>

        <!-- Sections Tab Content -->
        <div v-show="activeTab === 'sections'" class="tab-content">
          <div class="content-grid">
            <button
              v-for="section in sections"
              :key="section.id"
              class="content-button"
              @click="handleInsertSection(section.id)"
            >
              <span class="content-title">{{ section.name }}</span>
              <span class="content-description">{{ section.description }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-wrapper {
  position: relative;
  display: inline-block;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  background: #f9fafb;
}

.plus-icon {
  font-size: 16px;
  line-height: 1;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 51;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}

.close-button:hover {
  color: #374151;
}

.tabs {
  padding: 16px;
}

.tab-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px;
  margin-bottom: 16px;
}

.tab-button {
  padding: 8px 16px;
  background: none;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background: white;
  color: #111827;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-button:hover:not(.active) {
  color: #374151;
}

.tab-content {
  margin-top: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.content-button {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.content-button:hover {
  background: #f9fafb;
}

.content-title {
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.content-description {
  font-size: 14px;
  color: #6b7280;
}
</style>
