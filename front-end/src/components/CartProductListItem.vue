<template>
  <div class="product-container">
    <img class="product-image" :src="getImageUrl(product.product.imageUrl)">
    <div class="details-wrap">
      <h3>{{ product.product.name }}</h3>
      <p>$ {{ product.product.price }}</p>
    </div>
    <div class="actions-wrap">
      <span>Qty</span>
      <p class="counting">{{ product.count }}</p>

      <p >
          <span>
               <i class="arrow up" @click="handleAddtoCart(product.product.id)"></i>
               <i class="arrow down"  @click="handleRemoveFromCart(product.product.id)"></i>
         </span>
      </p>
      <button class="remove-button remove-text" @click="handleRemoveFromCart(product.product.id)">
        Remove item from cart
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: "CartProductList",
  props:{
    product: {
      type: Object,
      required: true
    },
  }
}
</script>

<style scoped>

</style>