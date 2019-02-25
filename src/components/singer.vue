<template>
  <div class="singer-container">
    <scroll ref="singerList"
      class="singer-list-box"
      :data="singerList"
      :probeType="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
      >
      <div class="singer-list" id="singerList">
        <div v-for="(item, singIndex) in singerList" ref="singerGroup" :key="singIndex">
          <div class="singer-class">{{ item.title }}</div>
          <div @click="selectSinger(singer)" class="singer-box" v-for="(singer, index) in item.list" :key="index">
            <div class="singer-img-box">
              <img class="singer-img" v-lazy="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+singer.id+'.jpg?max_age=2592000'" alt="">
            </div>
            <span class="singer-name">{{ singer.name}}</span>
          </div>
        </div>
      </div>
      <div class="right-class" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li :data-index="index" :class="{'active': currentIndex == index}" v-for="(item, index) in singerList" :key="index">
            {{ item.title.substr(0, 1) }}
          </li>
        </ul>
      </div>
      <div class="fix-title" ref="fixed" v-show="fixedTitle != ''">
        <div>{{ fixedTitle  }}</div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
// import $ from 'jquery'
import { getSingerList } from '@/api/singer.js'
import Scroll from '@/components/base/scroll'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@/common/js/mixin'

export default {
  name: 'singer',
  mixins: [playlistMixin],
  data () {
    return {
      singerList: [],
      currentIndex: 0,
      touch: {},
      listenScroll: true,
      probeType: 3,
      scrollY: -1,
      listHeight: [],
      fixedTitle: '',
      diff: -1,
      fixedTop: 0
    }
  },
  created () {
    this._getSingerList()
  },
  watch: {
    scrollY (newY) {
      if (this.scrollY > 0) {
        this.fixedTitle = ''
      } else {
        this.fixedTitle = this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
      }
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    singerList () {
      var that = this
      setTimeout(() => {
        that._calculateHeight()
      }, 20)
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < (this.$refs.fixed.clientHeight)) ? newVal - (this.$refs.fixed.clientHeight) : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    handlePlaylist (playList) {
      var bottom = playList.length > 0 ? '1rem' : ''
      this.$refs.singerList.$el.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger (singer) {
      this.setSinger(singer)
      this.$router.push('/singer/' + singer.id)
    },
    _getSingerList () {
      var that = this
      getSingerList().then(response => {
        this.singerList = that._normalizeSingerData(response.list)
      }).catch(error => {
        console.log(error)
      })
    },
    _normalizeSingerData (singerList) {
      var map = {
        hot: {
          title: '热门歌手',
          list: []
        }
      }
      singerList.forEach((item, index) => {
        if (index < 10) {
          map.hot.list.push({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        }
        var key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: item.Findex,
            list: []
          }
        }
        map[key].list.push({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        })
      })
      // 排序
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === '热门歌手') {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    onShortcutTouchStart (e) {
      // var classValue = e.path[0].attributes[1].nodeValue
      // this.currentIndex = classValue
      // window.location.hash = '#class_' + classValue
      var index = e.target.getAttribute('data-index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.index = index
      this.$refs.singerList.scrollToElement(this.$refs.singerGroup[index], 0)
      // this.currentIndex = index
      this.scrollY = -this.listHeight[index]
    },
    onShortcutTouchMove (e) {
      var height = e.target.clientHeight
      this.touch.y2 = e.touches[0].pageY
      var moveIndex = (this.touch.y2 - this.touch.y1) / height | 0
      var index = parseInt(this.touch.index) + moveIndex
      this.$refs.singerList.scrollToElement(this.$refs.singerGroup[index], 0)
      this.scrollY = -this.listHeight[index]
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _calculateHeight () {
      this.listHeight = []
      var height = 0
      var list = this.$refs.singerGroup
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.fix-title {
  position: absolute;
  top: 0;
  padding: 0.1rem 0.3rem;
  background: #e8e8e8;
  font-size: 0.28rem;
  color: #222;
  width: 100%;
}
.singer-list-box {
  margin-top: 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  z-index: 99;
}
.singer-list {
  background: #e2fffc;
  .singer-box {
    display: flex;
    display: -webkit-flex;
    width: 90%;
    margin: 0 auto;
    padding: 0.1rem 0;
    align-items: center;
    font-size: 0.26rem;
    color: #096c64;
  }
  .singer-img-box {
    width: 1.3rem;
  }
  .singer-class {
    padding: 0.1rem 0.3rem;
    background: #e8e8e8;
    font-size: 0.28rem;
    color: #222;
  }
}
.singer-img {
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
}
.right-class {
  position: fixed;
  top: 0;
  font-size: 0.24rem;
  right: 0;
  bottom: 0;
  display: table;
  height: auto;
  margin: auto;
  ul {
    list-style: none;
    padding: 0 0.08rem 0 0;
    margin: 0;
    text-align: center;
    margin-top: 2rem;
    background: #049588;
    padding: 0.2rem 0.05rem;
    border-radius: 0.3rem;
    color: #f2f8f8;
    li {
      padding: 0.01rem 0;
      margin: 0;
    }
  }
  .active {
    color: #ebde4f
  }
}
</style>
