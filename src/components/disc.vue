<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :imgUrl="imgUrl"></music-list>
  </transition>
</template>

<script>
import MusicList from './musicList'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommond'
import { createSong } from '@/common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    imgUrl () {
      return this.disc.imgurl
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommond')
        return
      }
      var that = this
      getSongList(this.disc.dissid).then(response => {
        that.songs = that._normalizeSongList(response.cdlist[0].songlist)
      }).catch(error => {
        console.log(error)
      })
    },
    _normalizeSongList (list) {
      var songList = []
      list.forEach((item, index) => {
        if (item.songid && item.albummid) {
          songList.push(createSong(item))
        }
      })
      return songList
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
