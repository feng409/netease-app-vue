<template>
  <div class="singer-detail-container">
    <div class="music-list-top" ref="imgBox">
      <div class="music-header" ref="header">
        <img class="return-icon" @click="$router.back()" src="../common/images/return.png" alt="">
        <p class="head-title">{{ title }}</p>
      </div>
      <div ref="bgImg" class="music-img-box" @load="loadImg" :style="{'background-image': 'url(' +  imgUrl +')'}">
        <div ref="mask" class="mask"></div>
      </div>
      <div>
        <div ref="playBtn" class="play-btn" v-show="songs.length > 0">
          <img class="play-icon" src="../common/images/play-icon.png">
          <span @click="random" style="vertical-align: middle;">随机播放</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" v-show="songs.length > 0" ref="bgLayer"></div>
    <scroll ref="scroll"
      @scroll="scroll"
      :probeType="probeType"
      :listenScroll="listenScroll"
      :data="songs"
      class="songs-warpper"
    >
      <div class="songs-content">
        <songs-list @selectItem="selectItem" :rank="rank" :songs="songs"></songs-list>
      </div>
    </scroll>
    <loading v-show="songs.length == 0"></loading>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Scroll from './base/scroll'
import SongsList from './songList'
import Loading from './base/loading'

export default {
  name: 'musicList',
  props: {
    songs: {
      type: Array,
      default () {
        return { songs: [] }
      }
    },
    title: {
      type: String,
      default: ''
    },
    imgUrl: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: -1,
      bgImgHeight: 0,
      headerHeight: 0,
      minTransformY: 0
    }
  },
  mounted () {
    this.bgImgHeight = this.$refs.bgImg.clientHeight
    this.headerHeight = this.$refs.header.clientHeight
    this.minTransformY = -this.bgImgHeight + this.headerHeight
  },
  watch: {
    scrollY (newY) {
      var zIndex = 0
      var scale = 1
      var transformY = Math.max(this.minTransformY, newY)
      var percent = Math.abs(newY / this.bgImgHeight)
      if (newY > 0) {
        scale = 1 + percent
      }
      if (newY < this.minTransformY) {
        zIndex = 10
        this.$refs.bgImg.style.height = `${this.headerHeight}px`
        this.$refs.mask.style.height = `${this.headerHeight}px`
        this.$refs.imgBox.style.zIndex = 104
        this.$refs.imgBox.style.height = `${this.headerHeight}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImg.style.height = '4.5rem'
        this.$refs.playBtn.style.display = 'block'
        this.$refs.mask.style.height = '4.5rem'
        this.$refs.imgBox.style.height = '4.5rem'
        this.$refs.imgBox.style.zIndex = 0
      }
      this.$refs.bgImg.style.zIndex = zIndex
      this.$refs.bgLayer.style.transform = `translate3d(0,${transformY}px,0)`
      this.$refs.bgImg.style.transform = `scale(${scale})`
    }
  },
  methods: {
    loadImg () {
      this.$refs.scroll.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random () {
      this.randomPlay({list: this.songs})
    }
  },
  components: {
    Scroll,
    SongsList,
    Loading
  }
}
</script>

<style scoped lang="scss">
.head-title {
  padding: 0;
  width: 82%;
  margin: 0 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.bg-layer {
    position: relative;
    background: #e2fffc;
    height: 100%;
    z-index: 103;
}
.songs-content {
  padding: 0.3rem 0;
}
.songs-warpper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 103;
  margin-top: 4.5rem;
}
.singer-detail-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 104;
  background: #e2fffc;
}
.music-list-top {
    position: relative;
  .music-header {
    font-size: 0.3rem;
    text-align: center;
    position: absolute;
    color: #eee;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 0.2rem;
    z-index: 100;
  }
}
.play-btn {
  position: absolute;
  bottom: 0.4rem;
  z-index: 101;
  font-size: 0.26rem;
  border: 0.01rem solid #e2fffc;
  color: #eee;
  width: 2rem;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  border-radius: 1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  .play-icon {
    width: 0.32rem;
    height: 0.32rem;
    vertical-align: middle;
    padding-right: 0.1rem;
  }
}
.mask {
  height: 4.5rem;
  width: 100%;
  background: rgba($color: #000000, $alpha: 0.4)
}
.music-img-box {
  height: 4.5rem;
  width: 100%;
  background-size: cover;
  position: relative;
}
.return-icon {
  position: absolute;
  left: 0.2rem;
  top: 0.17rem;
  vertical-align: middle;
  z-index: 101;
  width: 0.4rem;
  height: 0.4rem;
}
</style>
