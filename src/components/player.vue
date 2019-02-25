<template>
  <div class="player-container" v-show="playList.length > 0">
    <div class="full-player" v-show="fullScreen">
      <div class="background-box">
        <img class="background-img" :src="currentSong.imageUrl" alt="">
      </div>
      <div class="player-content">
        <div class="top-box">
          <img class="bottom-icon" @click="showMiniPlayer" src="../common/images/bottom.png" alt="">
          <p class="song-name">{{ currentSong.name }}</p>
          <p  class="songer">{{ currentSong.singer }}</p>
        </div>
        <div class="middle-box"
          @touchstart.prevent="touchMiddleStart"
          @touchmove.prevent="touchMiddleMove"
          @touchend="touchMiddleEnd">
          <div ref="middleL" class="player-box">
            <img ref="playerImg" :src="currentSong.imageUrl" alt="">
            <p style="margin: 1rem 0 0 0; padding: 0;" v-if="currentLyric && currentLyric.lines">{{ currentLyric.lines[currentLineNum].txt }}</p>
          </div>
          <scroll ref="lyricList" :data="currentLyric && currentLyric.lines" v-if="currentLyric" class="lyric-box-right">
            <div>
              <p ref="lyricLine" :class="{'active': currentLineNum === index}" v-for="(item, index) in currentLyric.lines" :key="index">
                {{ item.txt }}
              </p>
            </div>
          </scroll>
        </div>
        <div class="bottom-box">
          <div class="page-type">
            <span :class="{'select-page': currentPage == 'cd'}"></span>
            <span :class="{'select-page': currentPage == 'lyric'}"></span>
          </div>
          <div class="progress-bar-box">
            <span>{{ format(currentTime) }}</span>
            <div ref="progressBottom" @click="progressClick" class="progress-bottom">
              <div ref="progressTop" class="progress-top"></div>
              <div
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd"
                ref="progressBtn"
                class="progress-btn"></div>
            </div>
            <span>{{ format(currentSong.duration) }}</span>
          </div>
          <div class="player-icon-ground">
            <div class="left-grounp-icon" @click="changePlayMode">
              <img v-show="mode === 0" src="../common/images/player/sequence.png" alt="">
              <img v-show="mode === 1" src="../common/images/player/repeat.png" alt="">
              <img v-show="mode === 2" src="../common/images/player/shuffle.png" alt="">
            </div>
            <div class="right-grounp-icon" @click="prevSong">
              <img src="../common/images/player/previous.png" alt="">
            </div>
            <div class="middle-grounp-icon" @click="togglePlaying">
              <img v-show="playingStateIcon === 'play'" src="../common/images/player/play.png" alt="">
              <img v-show="playingStateIcon === 'pause'" src="../common/images/player/pause.png" alt="">
            </div>
            <div class="right-grounp-icon" @click="nextSong">
              <img src="../common/images/player/skip.png" alt="">
            </div>
            <div class="right-grounp-icon">
              <img src="../common/images/player/like.png" alt="">
              <!-- <img src="../common/images/player/liked.png" alt=""> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio
      ref="audio"
      :src="currentSong.url"
      @timeupdate="updateTime"
      @canplay="ready"
      @error="error"
      @ended="endSong"></audio>
    <div class="mini-player" @click="openFullScreen" v-show="!fullScreen">
      <div class="mini-player-content">
        <div class="left">
          <img class="song-img" :src="currentSong.imageUrl" alt="">
          <div style="padding-left: 0.2rem;">
            <div style="padding: 0.1rem 0.2rem 0;">{{ currentSong.name }}</div>
            <div style="padding: 0.1rem 0.2rem 0; font-size: 0.22rem; color: #01402f;">{{ currentSong.singer }}</div>
          </div>
        </div>
        <div class="mini-player-icon">
          <div style="padding-left: 0.2rem" @click.stop="togglePlaying">
            <img v-show="playingStateIcon === 'play'" src="../common/images/player/play.png" alt="">
            <img v-show="playingStateIcon === 'pause'" src="../common/images/player/pause.png" alt="">
          </div>
          <div style="padding-left: 0.2rem" @click.stop="showPlayListModal">
            <img src="../common/images/list-icon.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <play-list ref="playList"></play-list>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getSongLyric } from '@/api/song'
import Lyric from 'lyric-parser'
import Scroll from './base/scroll'
import PlayList from './playList'
import { playerMixin } from '@/common/js/mixin'

export default {
  name: 'player',
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      touch: {},
      currentLyric: null,
      currentLineNum: 0,
      currentPage: 'cd',
      middleTouch: {}
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex'
    ]),
    playingStateIcon () {
      return this.playing ? 'pause' : 'play'
    },
    playPercent () {
      return this.currentTime / this.currentSong.duration
    }
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong === oldSong) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      var that = this
      this.$nextTick(() => {
        that.$refs.audio.play()
        this._getSongLyric()
      })
    },
    playing () {
      var that = this
      this.$nextTick(() => {
        that.$refs.playerImg.className = that.playing ? 'play-animation' : 'play-animation  pause-animation'
        that.playing ? that.$refs.audio.play() : that.$refs.audio.pause()
      })
    },
    playPercent (newPercent) {
      // 通过 当前时间占总时间的比例
      var progressBottomWidth = this.$refs.progressBottom.clientWidth
      var progressBtnWidth = this.$refs.progressBtn.clientWidth
      var progressTopWidth = newPercent * (progressBottomWidth - progressBtnWidth)
      this.$refs.progressTop.style.width = progressTopWidth + 'px'
      this.$refs.progressBtn.style.transform = 'translate3d(' + progressTopWidth + 'px, 0, 0)'
    }
  },
  methods: {
    ...mapActions([
      'savePlayList'
    ]),
    showPlayListModal () {
      this.$refs.playList.show()
    },
    touchMiddleStart (e) {
      this.middleTouch.initiated = true
      const touch = e.touches[0]
      this.middleTouch.startX = touch.pageX
      this.middleTouch.startY = touch.pageY
    },
    touchMiddleMove (e) {
      if (!this.middleTouch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.middleTouch.startX
      const deltaY = touch.pageY - this.middleTouch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentPage === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.middleTouch.percent = Math.abs(offsetWidth / window.innerWidth)
      if (TouchList.$refs.lyricList) {
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
      }
      this.$refs.middleL.style.opacity = 1 - this.middleTouch.percent
      this.$refs.middleL.style.transitionDuration = 0
    },
    touchMiddleEnd () {
      let offsetWidth
      let opacity
      if (this.currentPage === 'cd') {
        if (this.middleTouch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentPage = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.middleTouch.percent < 0.9) {
          offsetWidth = 0
          this.currentPage = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      if (this.$refs.lyricList) {
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
      }
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style.transitionDuration = `${time}ms`
      this.middleTouch.initiated = false
    },
    _getSongLyric () {
      var that = this
      getSongLyric(this.currentSong.mid).then((lyric) => {
        that.currentLyric = new Lyric(lyric, that.handleLyric)
        that.currentLyric.play()
      }).catch(error => {
        this.currentLyric = null
        this.currentLineNum = 0
        console.log(error)
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    progressTouchStart (e) {
      this.touch.initited = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progressTop.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initited) {
        return
      }
      var deltaX = e.touches[0].pageX - this.touch.startX
      var offsetWidth = Math.min(this.$refs.progressBottom.clientWidth - this.$refs.progressBtn.clientWidth, Math.max(0, this.touch.left + deltaX))
      this.$refs.progressTop.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)'
    },
    progressTouchEnd () {
      this.touch.initited = true
      var precent = this.$refs.progressTop.clientWidth / (this.$refs.progressBottom.clientWidth - this.$refs.progressBtn.clientWidth)
      var currentTime = this.currentSong.duration * precent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    progressClick (e) {
      var offsetWidth = e.pageX - this.$refs.progressBottom.getBoundingClientRect().left
      this.$refs.progressTop.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)'
      var precent = this.$refs.progressTop.clientWidth / (this.$refs.progressBottom.clientWidth - this.$refs.progressBtn.clientWidth)
      var currentTime = this.currentSong.duration * precent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    showMiniPlayer () {
      this.setFullScreen(false)
    },
    openFullScreen () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    nextSong () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loopSong()
      } else {
        var index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        if (!this.playing) {
          this.togglePlaying()
        }
        this.setCurrentIndex(index)
      }
      this.songReady = true
    },
    prevSong () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 0) {
        this.loopSong()
      } else {
        var index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        if (!this.playing) {
          this.togglePlaying()
        }
        this.setCurrentIndex(index)
      }
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    endSong () {
      if (this.mode === 1) {
        this.loopSong()
      } else {
        this.nextSong()
      }
    },
    loopSong () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    format (interval) {
      interval = interval | 0
      var minute = interval / 60 | 0
      var second = this._pad(interval % 60)
      return minute + ':' + second
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ready () {
      this.songReady = true
      this.savePlayList(this.currentSong)
    },
    error () {
      this.songReady = true
    }
  },
  components: {
    Scroll,
    PlayList
  }
}
</script>

<style scoped lang="scss">
.bottom-box {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
  z-index: 107;
  .page-type {
    span {
      width: 0.1rem;
      height: 0.1rem;
      background: #e2fffc;
      display: inline-block;
      border-radius: 50%;
    }
    .select-page {
      width: 0.2rem;
    }
  }
  .progress-bar-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 80%;
    margin: 0 auto;
    padding: 0.3rem 0;
    font-size: 0.22rem;
    span {
      display: inline-block;
      width: 0.6rem;
    }
    .progress-bottom {
      width: 4rem;
      background: #222;
      height: 0.06rem;
      position: relative;
    }
    .progress-top {
      background: #fff;
      width: 0;
      position: absolute;
      height: 0.06rem;
      z-index: 108;
    }
    .progress-btn {
      width: 0.2rem;
      border-radius: 50%;
      background: #6b7c76;
      height: 0.2rem;
      position: absolute;
      top: 0;
      z-index: 109;
      bottom: 0;
      left: -1px;
      display: table;
      margin: auto;
      border: 0.03rem solid #eee;
    }
  }
}
.play-animation {
  animation: rotate 10s linear infinite;
  animation-fill-mode : forwards;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg)
  }
}
.pause-animation {
  animation-play-state: paused;
}
.mini-player-content {
  display: flex;
  justify-content: space-between;
  width: 93%;
  height: 100%;
  margin: 0 auto;
  .left {
    display: flex;
    align-items: center;
  }
}
.mini-player {
  position: fixed;
  z-index: 106;
  background: #049588;
  width: 100%;
  height: 1rem;
  bottom: 0;
  font-size: 0.26rem;
  .song-img {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
  }
  .mini-player-icon {
    display: flex;
    align-items: center;
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
}
.player-container {
  color: #e2fffc;
  .full-player {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 105;
    font-size: 0.3rem;
    background-color: #222;
  }
  .background-box {
    width: 100%;
    height: 100%;
    background-size: cover;
    -webkit-filter: blur(20px);
    -moz-filter: blur(20px);
    -o-filter: blur(20px);
    -ms-filter: blur(20px);
    filter: blur(20px);
    opacity: 0.6;
  }
  .background-img {
    width: 100%;
    height: 100%;
  }
}
.player-icon-ground{
  display: flex;
  display: -webkit-flex;
  width: 80%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
}
.player-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  .middle-grounp-icon {
    img {
      width: 0.64rem;
      height: 0.64rem;
    }
  }
  .right-grounp-icon, .left-grounp-icon {
    img {
      width: 0.48rem;
      height: 0.48rem;
    }
  }
}
.top-box {
  color: #e2fffc;
  font-size: 0.26rem;
  margin: 0.2rem;
  position: relative;
  .bottom-icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0;
    left: 0;
    z-index: 106;
  }
  .songer, .song-name {
    font-size: 0.24rem;
    padding: 0;
    width: 82%;
    margin: 0.15rem auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.middle-box {
  position: absolute;
  top: 1.3rem;
  bottom: 2.4rem;
  display: flex;
  white-space: nowrap;
  z-index: 108;
  overflow: hidden;
  font-size: 0.25rem;
  img {
    width: 5rem;
    height: 5rem;
    border: 10px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    box-sizing: border-box;
  }
  .player-box, .lyric-box-right {
    width: 6.4rem;
  }
  .lyric-box-right p {
    padding: 0;
    margin: 0.3rem 0;
  }
  .lyric-box-right .active {
    color: #ffeb3b !important;
  }
}
</style>
