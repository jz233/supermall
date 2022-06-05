<template>
  <div class="goods">
    <!--  子组件里没有slot， 不需要多标签，单标签就可以-->
    <goods-list-item v-for="item in goods" :goods-item="item"/>
    <!--  {{ goods }}-->
  </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  /*padding: 2px;*/
}


</style>
