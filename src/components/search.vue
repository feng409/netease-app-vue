<template>
  <div>
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <scroll :data="searchHistory && hotkey" ref="searchHistoryBox" class="search-content">
      <!-- 热门搜索 -->
      <div style="padding: 0.5rem 0;box-sizing: border-box;">
        <div v-show="!query" class="hotkey-list">
          <div style="color: #757575;font-size: 0.24rem;padding-bottom: 0.2rem;">热门搜索</div>
          <span @click="addQuery(item.k)" class="hotkey" v-for="(item, index) in hotkey" :key="index">{{ item.k }}</span>
        </div>
        <!-- 搜索历史 -->
        <div v-show="searchHistory.length > 0" class="search-history-box">
          <div class="search-history-title">
            <span>搜索历史</span>
            <img class="delAll-img" @click="delAllSearch" src="../common/images/delAll.png" alt="">
          </div>
          <div class="search-list">
            <div @click="addQuery(item)" class="search-item" v-for="(item, index) in searchHistory" :key="index">
              <span>{{item}}</span>
              <img @click.stop="delSearch(item)" src="../common/images/close-1.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <suggest ref="suggestBox" v-show="query" @selectResult="saveSearch" :query="query"></suggest>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from './base/searchBox'
import Scroll from './base/scroll'
import { playlistMixin, searchMixin } from '@/common/js/mixin'
import { gethotkey } from '@/api/search'
import Suggest from './suggest'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'search',
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    Scroll
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  created () {
    this._gethotkey()
  },
  methods: {
    delAllSearch () {
      this.delAllSearchHistory()
    },
    ...mapActions([
      'delAllSearchHistory'
    ]),
    handlePlaylist (playlist) {
      var bottom = playlist.length > 0 ? '1rem' : ''
      this.$refs.suggestBox.$el.style.bottom = bottom
      this.$refs.searchHistoryBox.$el.style.bottom = bottom
    },
    onQueryChange (newQuery) {
      this.query = newQuery
    },
    _gethotkey () {
      var that = this
      gethotkey().then(response => {
        that.hotkey = response.hotkey.slice(0, 10)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-content {
  position: fixed;
  top: 2.45rem;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e2fffc;
  z-index: 103;
  overflow: hidden;
}
.search-history-box {
  font-size: 0.24rem;
  text-align: center;
  width: 77%;
  margin: 0 auto;
  .search-history-title {
    position: relative;
    color: #757575;
    font-size: 0.24rem;
    margin: 0.4rem 0;
  }
  .delAll-img {
    position: absolute;
    right: 0;
    width: 0.35rem;
    height: 0.35rem;
    margin: auto;
    display: table;
    top: 0;
    bottom: 0;
  }
  .search-list {
    color: #0a9388;
    text-align: left;
    .search-item {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      padding-bottom: 0.1rem;
      align-items: center;
    }
    img {
      width: 0.35rem;
      height: 0.35rem;
    }
  }
}
.search-page {
  background: #e2fffc;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 1.5rem;
  z-index: 101;
  overflow: hidden;
}
.hotkey-list {
  font-size: 0.22rem;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  .hotkey {
    background: #079488;
    color: #e2fffc;
    padding: 0.1rem;
    display: inline-block;
    margin: 0.06rem;
    border-radius: 0.05rem;
  }
}
</style>
