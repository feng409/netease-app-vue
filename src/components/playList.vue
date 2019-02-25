<template>
  <transition name="list-fade">
    <div v-show="showPlayList" @click="hide">
      <div class="play-list-mask" @click.stop>
        <div class="play-list-box">
          <div class="play-list-container">
              <div class="play-list-top">
                <div class="play-type-box">
                  <div class="left" @click="changePlayMode">
                    <img v-show="mode === 0" src="../common/images/playlist/sequence.png" alt="">
                    <img v-show="mode === 1" src="../common/images/playlist/repeat.png" alt="">
                    <img v-show="mode === 2" src="../common/images/playlist/shuffle.png" alt="">
                    <span v-show="mode === 0">顺序播放</span>
                    <span v-show="mode === 1">单曲播放</span>
                    <span v-show="mode === 2">随机播放</span>
                  </div>
                  <img @click="delAllSong" src="../common/images/playlist/delAll.png" alt="">
                </div>
              </div>
              <!-- 列表 -->
              <scroll ref="listContent" :data="sequenceList" style="max-height: 7rem; overflow: hidden">
                <div class="play-lists">
                  <div ref="listItem" @click="selectItem(item, index)" class="play-item" v-for="(item, index) in sequenceList" :key="index">
                    <img class="play-icon" v-show="isShowPlayIcon(index)" src="../common/images/playlist/play.png" alt="">
                    <div class="songname-box">
                      <p class="songname">{{ item.name }}</p>
                    </div>
                    <img src="../common/images/playlist/like.png" alt="">
                    <!-- <img src="../common/images/playlist/liked.png" alt=""> -->
                    <img src="../common/images/close-1.png" @click.stop="delItem(item)" alt="">
                  </div>
                </div>
              </scroll>
              <div class="add-song-box" @click="showAddSong">
                <img src="../common/images/playlist/add.png" alt="">
                <span>添加歌曲到列表</span>
              </div>
          </div>
          <div @click="hide" class="bootom-close">
            <span>关闭</span>
          </div>
        </div>
      </div>
      <add-song ref="addSongPage"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Scroll from './base/scroll'
import { playerMixin } from '@/common/js/mixin'
import AddSong from './addSong'

export default {
  name: 'playlist',
  mixins: [playerMixin],
  components: {
    Scroll,
    AddSong
  },
  data () {
    return {
      showPlayList: false
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (!this.showPlayList || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  methods: {
    showAddSong () {
      this.$refs.addSongPage.show()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'delectSong',
      'delAllSongList'
    ]),
    delAllSong () {
      this.delAllSongList()
    },
    selectItem (item, index) {
      if (this.mode === 2) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    delItem (song) {
      this.delectSong(song)
      if (this.playlist.length) {
        this.hide()
      }
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    isShowPlayIcon (index) {
      if (this.currentIndex === index) {
        return true
      }
      return false
    },
    show () {
      this.showPlayList = true
      var that = this
      setTimeout(() => {
        that.$refs.listContent.refresh()
        that.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showPlayList = false
    }
  }
}
</script>

<style scoped lang="scss">
.play-list-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 106;
  background: rgba(0,0,0,0.8);
  padding: 0.4rem;
  .play-list-box {
    position: absolute;
    bottom: 0;
    z-index: 107;
    left: 0;
    right: 0;
    background: #e2fffc;
    color: #0f867a;
    padding: 0.3rem 0 0;
    .play-list-container {
      width: 90%;
      margin: 0 auto;
      font-size: 0.28rem;
    }
    .bootom-close {
      width: 100%;
      text-align: center;
      background-color: #0f867a;
      font-size: 0.3rem;
      height: 0.7rem;
      line-height: 0.7rem;
      color: #e2fffc;
    }
  }
}
.play-type-box {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  img {
    width: 0.5rem;
    height: 0.5rem;
  }
  span {
    margin-left: 0.2rem;
  }
  .left {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
  }
}
.play-lists {
  .play-item {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    .songname-box {
      width: 0;
      flex: 1;
    }
    p {
      padding: 0;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .play-icon {
      width: 0.32rem;
      height: 0.32rem;
      margin-right: 0.2rem;
    }
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.1rem
    }
  }
}
.add-song-box {
    border: 0.02rem solid;
    border-radius: 0.3rem;
    width: 3rem;
    height: 0.6rem;
    line-height: 0.6rem;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 0.2rem;
    margin: 0.3rem auto;
  img {
    width: 0.5rem;
    height: 0.5rem;
  }
}
.list-fade-enter-active, .list-fade-leave-active {
  transition: opacity 0.3s;
  .list-wrapper{
    transition: all 0.3s;
  }
}
.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
  .list-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}
.list-fade-enter{
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
