<template>
  <scroll ref="suggest" @scrollEnd="searchMore" :data="result" :pullup="pullup" class="suggest-box">
    <div v-if="result" class="songs-list">
      <div @click="selectItem(item)" class="result-box" v-for="(item, index) in result" :key="index">
        <img v-show="item.type == 'singer'" src="../common/images/man.png" alt="">
        <img v-show="!item.type" src="../common/images/music.png" alt="">
        <p>{{item.type === 'singer' ? item.singername : item.album + '--' + item.singer }}</p>
      </div>
      <loading style="padding: 0.2rem;" v-show="hasMore"></loading>
    </div>
  </scroll>
</template>

<script>
import { getSearchList } from '@/api/search'
import Scroll from './base/scroll'
import Loading from './base/loading'
import { mapMutations, mapActions } from 'vuex'
import { createSong } from '@/common/js/song'

const PERPAGE = 20

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: String,
      default: '1'
    }
  },
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true
    }
  },
  watch: {
    query () {
      this._getSearchList()
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    selectItem (item) {
      console.log(item)
      if (item.type === 'singer') {
        var singer = {
          id: item.singermid,
          name: item.singername
        }
        this.setSinger(singer)
        this.$router.push(`/search/${item.singermid}`)
      } else {
        this.insertSong(item)
      }
      this.$emit('selectResult', item)
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSearchList(this.query, this.page, this.showSinger, PERPAGE).then(response => {
        this.result = this.result.concat(this._genResult(response))
        this._checkMore(response)
      }).catch(error => {
        console.log(error)
      })
    },
    _getSearchList () {
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      getSearchList(this.query, this.page, this.showSinger, PERPAGE).then(response => {
        console.log(response)
        this.hasMore = true
        this.result = this._genResult(response)
        this._checkMore(response)
      }).catch(error => {
        console.log(error)
      })
    },
    _checkMore (data) {
      var song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: 'singer'}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      var songs = []
      list.forEach((item, index) => {
        if (item.songid && item.albummid) {
          songs.push(createSong(item))
        }
      })
      return songs
    }
  }
}
</script>

<style scoped lang="scss">
.suggest-box {
  font-size: 0.24rem;
  color: #079488;
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  position: fixed;
  top: 2.6rem;
  right: 0;
  bottom: 0;
  z-index: 104;
  left: 0;
  background: #e2fffc;
  .result-box {
    display: flex;
    display: -webkit-flex;
    padding: 0.1rem 0;
    box-sizing: border-box;
  }
  img {
    width: 0.3rem;
    height: 0.3rem;
    padding: 0 0.2rem;
    vertical-align: middle;
  }
  p {
    padding: 0;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
