<template>
  <div class="slider-wrapper" ref="wrapper">
    <div class="slider-container" ref="container">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :key="item" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
  </template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      slider: {},
      currentPageIndex: 0,
      timer: {},
      dots: []
    }
  },
  mounted: function () {
    var that = this
    setTimeout(() => {
      that._setSliderWidth()
      that._initDots()
      that._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth () {
      let width = 0
      // 获取一张轮播图的大小
      let sliderWidth = this.$refs.wrapper.clientWidth
      // 获取轮播图demo
      let child = this.$refs.container.children
      for (let i = 0; i < child.length; i++) {
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.container.style.width = width + 'px'
    },
    _initDots () {
      var child = this.$refs.container.children
      this.dots = new Array(child.length)
    },
    _initSlider () {
      var that = this
      this.slider = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: that.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = that.slider.getCurrentPage().pageX// loop ? 2 : 1
        if (that.loop) {
          pageIndex -= 1
        }
        that.currentPageIndex = pageIndex
        if (that.autoPlay) {
          clearTimeout(that.timer)
          that._play()
        }
      })
    },
    _play () {
      // this.slider.getCurrentPage().pageX  loop ？1 ： 0   123456 1 23456 7
      var that = this
      var pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        that.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="scss">
.slider-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  line-height: 0;
}
.slider-container {
  display: flex;
  overflow: hidden;
  .slider-img {
    width: 6.4rem;
  }
}
.dots {
  position: absolute;
  bottom: 0.2rem;
  left: 0;
  right: 0;
  text-align: center;
  line-height: 0;
  .dot {
    display: inline-block;
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 0.05rem;
    background: #ddd;
    margin-right: 0.1rem;
  }
  .active {
    width: 0.2rem;
    background: #fb6161;
  }
}
</style>
