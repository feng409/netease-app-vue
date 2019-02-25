<template>
  <div>
    <scroll ref="scroll" class="recommond-container" :data="musicuList">
      <div>
        <mine-slider v-if="sliderList.length" >
          <div v-for="(item, index) in sliderList" :key="index">
            <img @load="loadImg" class="slider-img needsclick" :src="item.picUrl">
          </div>
        </mine-slider>

        <div style="background: rgb(225, 255, 252)">
          <p class="musicu-title">热歌推荐</p>
          <div>
            <loading v-show="musicuList.length == 0"></loading>
          </div>
          <div class="musicu-list-box">
            <div class="musicu" @click="selectDisc(item)" v-for="(item, index) in musicuList" :key="index">
              <div class="musicu-img-box">
                <img class="musicu-img" v-lazy="item.imgurl" alt="">
              </div>
              <div class="musicu-text-box">
                <p class="name">{{ item.creator.name }}</p>
                <p>{{ item.dissname }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSliderList, getMusicuList, getnew } from '@/api/recommond.js'
import MineSlider from '@/components/base/slider'
import Loading from '@/components/base/loading'
import Scroll from '@/components/base/scroll'
import { playlistMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'

import $ from 'jquery'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      sliderList: [],
      musicuList: [],
      checkloaded: false
    }
  },
  created: function () {
    this._getSliderList()
    this._getMusicuList()
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    selectDisc (item) {
      this.setDisc(item)
      this.$router.push('/recommond/' + item.dissid)
    },
    handlePlaylist (playlist) {
      var bottom = playlist.length > 0 ? '1rem' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getSliderList: function () {
      var that = this
      getSliderList().then((response) => {
        if (response.code === 0) {
          that.sliderList = response.data.slider
        }
      })
    },
    _getMusicuList () {
      var that = this
      getMusicuList().then((response) => {
        that.musicuList = response.data.list
      })
    },
    loadImg () {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  components: {
    MineSlider,
    Loading,
    Scroll
  }
}
</script>

<style scoped lang="scss">
.recommond-container {
  margin-top: 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.musicu-list-box {
  width: 92%;
  margin: 0 auto;
  font-size: 0.26rem;
  padding-bottom: 0.5rem;
  .musicu {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 0.15rem;
  }
  .musicu-img-box {
    width: 1.3rem;
  }
  .musicu-img {
    width: 1rem;
    height: 1rem;
  }
  .musicu-text-box {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-evenly;
    .name {
      color: #222;
      font-size: 0.26rem;
    }
  }
  p {
    color: #096c64;
    margin: 0;
    padding: 0;
    font-size: 0.24rem;
  }
}
.musicu-title {
  font-size: 0.3rem;
  padding: 0.2rem 0 0.1rem;
  margin: 0;
  text-align: center;
  color: #096c64;
  }
</style>
