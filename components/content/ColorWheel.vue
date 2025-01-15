<!-- components/content/Color-wheel.vue -->
<template>
  <div class="wheel-wrapper relative w-96 h-96 mx-auto">
    <div
      class="transform transition-transform duration-300 hover:-translate-y-2"
    >
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Sport Section - Red -->
        <path
          d="M50,50 L100,50 A50,50 0 0,0 50,0 Z"
          fill="#FF6B6B"
          class="transition-transform origin-center hover:scale-105"
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
          fill="#4ECDC4"
          class="transition-transform origin-center hover:scale-105"
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
          fill="#FFD93D"
          class="transition-transform origin-center hover:scale-105"
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
          fill="#95E1D3"
          class="transition-transform origin-center hover:scale-105"
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
</template>

<script setup>
defineComponent({
  name: "ContentColorWheel",
});
</script>
