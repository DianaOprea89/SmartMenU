<template>
  <div v-if="products.length > 0">
    <CartProductListItem
        v-for="product in products"
        :key="product.id"
        :product="product"
        :product-quantity="productQuantities[product.id] || 1"
        @remove-from-cart="handleRemoveFromCart"
        @add-to-cart="handleAddtoCart"

    ></CartProductListItem>
  </div>
  <p v-else>You haven't added anything to your cart yet</p>
</template>

<script>
import CartProductListItem from "@/components/CartProductListItem";

export default {
  name: "CartProductList",
  components: {CartProductListItem},
  props:{
    products: Array,
    productQuantities: Object,
    quantity: Number,
  }
}
</script>

<style scoped>

</style>