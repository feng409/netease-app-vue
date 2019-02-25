<template>
  <transition name="slide">
    <music-list :title="title" :rank="true" :songs="songs" :imgUrl="imgUrl"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/musicList'
import { getTopLists } from '@/api/rank'
import { mapGetters } from 'vuex'
import { createSong } from '@/common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title () {
      return this.topList.topTitle
    },
    imgUrl () {
      if (this.songs.length > 0) {
        return this.songs[0].imageUrl
      }
      return ''
    }
  },
  created () {
    this._getTopLists()
  },
  methods: {
    _getTopLists () {
      var that = this
      getTopLists(this.topList.id).then(response => {
        that.songs = that._normalizeTopListData(response.songlist)
      }).catch(error => {
        console.log(error)
      })
    },
    _normalizeTopListData (list) {
      var data = []
      list.forEach(item => {
        if (item.data.songid && item.data.albummid) {
          data.push(createSong(item.data))
        }
      })
      return data
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="scss">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
