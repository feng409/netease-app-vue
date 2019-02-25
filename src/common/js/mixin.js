import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from '@/common/js/until'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'playList',
      'currentSong',
      'mode',
      'sequenceList',
      'currentIndex'
    ])
  },
  methods: {
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    changePlayMode () {
      var playMode = (this.mode + 1) % 3
      this.setPlayMode(playMode)
      var list = []
      if (playMode === 2) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.playList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}

export const searchMixin = {
  methods: {
    ...mapActions([
      'delectSearch',
      'saveSearchHistory'
    ]),
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    delSearch (item) {
      this.delectSearch(item)
    },
    saveSearch (item) {
      this.saveSearchHistory(this.query)
    }
  }
}
