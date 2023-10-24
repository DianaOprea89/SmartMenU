<template>
  <li>{{ item.name }} - {{ item.price }}</li>
</template>

<script>
export default {
  props: {
    item: Object, // Menu item data
  },
};
</script>

<style scoped>
/* Add styling for menu items here */
</style>
