<template>
  <div>
    <h2>{{ mealType }}</h2>
    <ul>
      <base-menu-item v-for="item in items" :key="item.id" :item="item" />
    </ul>
  </div>
</template>

<script>
import BaseMenuItem from './BaseMenuItem.vue';

export default {
  components: {
    'base-menu-item': BaseMenuItem,
  },
  props: {
    mealType: String, // e.g., 'Starters', 'Main Courses', 'Desserts'
    items: Array,     // Array of menu items for the specific meal type
  },
};
</script>

<style scoped>
/* Add styling for the meal type section here */
</style>