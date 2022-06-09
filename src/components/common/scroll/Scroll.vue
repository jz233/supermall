<template>
<!--
ref 绑定子组件上 -- this.$refs.名字 获取到组件对象
ref 绑定普通元素上 -- this.$refs.名字 获取到元素对象
 -->
<div class="wrapper" ref="wrapper">
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      scroll: null
    }
  },
  mounted() {
    // 不要使用document.querySelector('.wrapper')，一个网页中可能存在多个叫wrapper的class，无法准确获取到该组件中的wrapper
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType
    })

    // 实时监听
    this.scroll.on('scroll', (position) => {
      // console.log(position);
      this.$emit('scroll', position)
    })

  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll.scrollTo(x, y, time)
    },
  }
}
</script>

<style scoped>

</style>
