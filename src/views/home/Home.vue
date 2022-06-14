<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" ref="tabControl1"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 v-show="isTabFixed"
    />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad()"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control  ref="tabControl2"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
      />
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <!--    .native 加上native之后才可以监听组件的点击-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";
import {getHomeMultidata, getHomeGoods} from "@/network/home";
import {debounce} from "@/common/utils";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},

      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false
    }
  },
  created() {
    // 1. 请求多个数据
    this.getHomeMultidata()
    // 2. 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


  },
  mounted() {
    // 1. 图片加载完成的事件监听
    // 参数不要传this.$refs.scroll.refresh()， 一旦带括号，说明是把函数执行后的返回值作为参数传进去，而不是函数体本身
    const refresh = debounce(this.$refs.scroll.refresh, 200);

    // 不要在created() 中获取$refs，可能会返回null， 应该在mounted() 中获取
    // 监听item中图片加载完成, 每次刷新获取页面滚动区域高度，避免滚动范围不准的bug
    this.$bus.$on('itemImageLoad', () => {
      // this.$refs.scroll && this.$refs.scroll.refresh()
      refresh()
    })

    // 2.获取tabControl的offsetTop
    // 所有组件都有一个属性$el ： 用于获取组件中的元素
    console.log(this.$refs.tabControl.$el.offsetTop);

  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    },
  },
  methods: {
    /**
     * 事件监听
     */
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    /**
     * 网络请求
     * */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 完成上拉加载更多，以便下一次拉到底部时进行再一次网络请求
        this.$refs.scroll.finishPullUp()
      })
    },
    backClick() {
      // console.log('backClick');
      // 访问scroll组件中的scroll属性
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      // 1.判断返回顶部按钮是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.判断TabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      // console.log('上拉加载更多');
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  /* vh 视口， 屏幕可见部分的高度*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 使用浏览器原生滚动时，为了不让导航栏跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}


.content {
  /*height: 300px;*/
  /*height: calc(100vh - 93px);*/
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
</style>
