<template>
  <div id="page-wrap">
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length > 0">
      <CartProductListItem
          :products="cartItems"
          :product-quantities="productQuantities"
          @remove-from-cart="removeFromCart"
          @add-to-cart="addtoCart"
      ></CartProductListItem>
    </div>
    <p v-else>You haven't added anything to your cart yet</p>

    <div>
      <h3 id="total-price" v-if="cartItems.length > 0">Total: ${{ cartTotal }}</h3>
      <button id="checkout-button">Proceed to Checkout</button>
    </div>
  </div>
</template>

<script>
import CartProductListItem from "@/components/CartProductListItem";
export default {
  name: "CheckOut",
  components:{CartProductListItem},
  data() {
    return {
      isLoading: false,
      cartItems: [],
      error: null,
      productQuantities: {}
    };
  },
  computed: {
    cartTotal() {
      const totalPrice = this.cartItems.reduce((accumulator, cartItem) => {
        const itemPrice = parseFloat(cartItem.product.price);
        if (!isNaN(itemPrice)) {
          return accumulator + itemPrice * cartItem.count;
        }
        return accumulator;
      }, 0);

      return totalPrice.toFixed(2);
    },
  },
}
</script>

<style scoped>

</style>