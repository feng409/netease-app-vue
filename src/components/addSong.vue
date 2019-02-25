<template>
  <transition name="slide">
    <div v-show="showAddSongPage" class="add-song-page" @click.stop>
      <div class="top-big-box">
        <div class="title-box">
          <span>添加歌曲到列表</span>
          <img @click="hide()" src="../common/images/close-1.png" alt="">
        </div>
        <search-box ref="searchBox" @query="search" placeholder="搜索歌曲"></search-box>
        <div v-show="!query" class="nav-box">
          <div @click="showType = 0" :class="{'selectNav': showType === 0}" style="border-radius: 0.1rem 0 0 0.1rem;" class="nav-item">最近播放</div>
          <div @click="showType = 1" :class="{'selectNav': showType === 1}" style="border-radius: 0 0.1rem 0.1rem 0;" class="nav-item">搜索历史</div>
        </div>
      </div>
      <div>
        <!-- 最近播放 -->
        <scroll class="content-box" ref="songList" :data="innerList" v-show="showType == 0 && query === ''">
          <div class="list-inner">
            <div @click="selectSong(item, index)" v-for="(item, index) in playHistory" :key="index" class="inner-item">
              <p class="name">{{ item.name}}</p>
              <p class="desc">{{ item.singer }} · {{item.album}}</p>
            </div>
          </div>
        </scroll>
        <!-- 搜索历史 -->
        <scroll class="content-box" ref="searchList" :data="searchHistory" v-show="showType == 1 && query === ''">
          <div class="search-list">
            <div @click="addQuery(item)" v-for="(item, index) in searchHistory" :key="index" class="search-item">
              <p class="search-key">{{ item }}</p>
              <img @click.stop="delSearch(item)" src="../common/images/close-1.png" alt="">
            </div>
          </div>
        </scroll>
        <!-- 搜索列表 -->
        <suggest @selectResult="selectSuggest" showSinger="0" v-show="query" :query="query"></suggest>
      </div>
      <top-tip ref="tipBox">
        <div class="tip">
          <img src="../common/images/ok.png" alt="">
          <span>歌曲已添加到播放歌曲列表中</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from './base/searchBox'
import Scroll from './base/scroll'
import Suggest from './suggest'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from '@/common/js/mixin'
import TopTip from './base/topTip'
import {Song} from '@/common/js/song'

export default {
  name: 'addSong',
  components: {
    SearchBox,
    Scroll,
    Suggest,
    TopTip
  },
  mixins: [searchMixin],
  data () {
    return {
      showAddSongPage: false,
      showType: 0,
      innerList: [],
      query: ''
    }
  },
  watch: {
    showType () {
      if (this.showType === 0) {
        this.$refs.songList.refresh()
      } else {
        this.$refs.searchList.refresh()
      }
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'playHistory'
    ])
  },
  methods: {
    ...mapActions([
      'insertSong'
    ]),
    show () {
      this.showAddSongPage = true
      setTimeout(() => {
        if (this.showType === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () {
      this.showAddSongPage = false
    },
    search (query) {
      this.query = query
    },
    selectSong (item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
      }
      this.$refs.tipBox.show()
    },
    selectSuggest () {
      this.saveSearch(this.query)
      this.$refs.tipBox.show()
    }
  }
}
</script>

<style scoped lang="scss">
.add-song-page {
  position: fixed;
  z-index: 108;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #e2fffc;
  color: #079488;
  font-size: 0.3rem;
  .top-big-box {
    .title-box {
      font-size: 0.32rem;
      text-align: center;
      position: relative;
      height: 0.7rem;
      line-height: 0.7rem;
      margin: 0.2rem;
      img {
        width: 0.6rem;
        height: 0.6rem;
        position: absolute;
        right: 0;
      }
    }
    .nav-box {
      display: flex;
      display: -webkit-flex;
      width: 80%;
      margin: 0 auto;
      text-align: center;
      .nav-item {
        background: #079488;
        color: #e2fffc;
        width: 3rem;
        height: 0.6rem;
        line-height: 0.6rem;
      }
      .selectNav {
        background: #066b62 !important;
      }
    }
  }
}
.content-box {
  position: absolute;
  z-index: 109;
  left: 0;
  right: 0;
  bottom: 0;
  top: 3rem;
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  .search-list {
    .search-item {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0;
      p {
        padding: 0;
        margin: 0;
      }
      img {
        width: 0.5rem;
        height: 0.5rem;
      }
    }
  }
}
.inner-item {
  padding: 0.1rem 0;
  p {
    padding: 0;
    margin: 0.1rem 0;
  }
  .name {
    font-size: 0.28rem;
  }
  .desc {
    font-size: 0.26rem;
    color: #7f8483;
  }
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
}
.tip {
  background: #079488;
  color: #e2fffc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
  img {
    width: 0.6rem;
    height: 0.6rem;
  }
}
</style>
