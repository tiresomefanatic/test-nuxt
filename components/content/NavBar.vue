<!-- components/content/CategoryNav.vue -->
<template>
  <nav class="mb-8">
    <ul class="flex justify-center items-center space-x-8">
      <li v-for="(category, index) in categories" :key="index">
        <button
          class="px-8 py-3 rounded-full transition-colors duration-200"
          :class="[
            selectedCategory === category
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900',
          ]"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </li>
    </ul>
    <div
      class="mt-4 h-0.5 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500"
    ></div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const categories = ["Vehicle", "Accessories", "Product", "Packaging"];
const selectedCategory = ref("Vehicle");

const selectCategory = (category) => {
  selectedCategory.value = category;
};

defineComponent({
  name: "NavBar",
});
</script>
