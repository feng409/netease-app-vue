<template>
  <transition name="drop">
    <div class="tip-box" v-show="showTip" @click="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'topTip',
  props: {
    time: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showTip: false,
      timer: {}
    }
  },
  methods: {
    show () {
      this.showTip = true
      var that = this
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        that.hide()
      }, this.time)
    },
    hide () {
      this.showTip = false
    }
  }
}
</script>

<style scoped lang="scss">
.drop-enter-active, .drop-leave-active{
  transition: all 0.3s;
  .drop-enter, .drop-leave-to{
    transform: translate3d(0, -100%, 0);
  }
}
.tip-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  width: 100%;
  text-align: center;
}
</style>
