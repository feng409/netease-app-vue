<template>
  <transition name="slide">
    <music-list :title="title" :imgUrl="imgUrl" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { getSingerDeatil } from '@/api/singerDetail'
import MusicList from '@/components/musicList'
import { mapGetters } from 'vuex'
import { createSong } from '@/common/js/song'

export default {
  name: 'singerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters({
      singerData: 'singer'
    }),
    title () {
      return this.singerData.name
    },
    imgUrl () {
      return 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + this.singerData.id + '.jpg?max_age=2592000'
    }
  },
  created () {
    this._getSingerDeatil()
  },
  methods: {
    _getSingerDeatil () {
      if (!this.singerData.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDeatil(this.singerData.id).then(response => {
        this.songs = this._normalizeSongs(response.data.list)
      }).catch(error => {
        console.log(error)
      })
    },
    _normalizeSongs (list) {
      var songs = []
      list.forEach((item, index) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          songs.push(createSong(musicData))
        }
      })
      return songs
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
