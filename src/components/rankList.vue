<template>
  <div>
    <scroll ref="rankscroll" :data="rankList" class="rank-list-box">
      <div class="rank-list">
        <div @click="selectRankItem(item)" v-for="(item, index) in rankList" :key="index" class="rank-box">
          <div class="left">
            <img :src="item.picUrl" alt="">
          </div>
          <div class="right">
            <p v-for="(song, index) in item.songList" :key="index">
              {{ index + 1 }}. {{ song.songname }}--{{ song.singername }}
            </p>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from '@/api/rank'
import { playlistMixin } from '@/common/js/mixin'
import Scroll from '@/components/base/scroll'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      rankList: []
    }
  },
  created () {
    this._getRankList()
  },
  methods: {
    handlePlaylist (playlist) {
      var bottom = playlist.length > 0 ? '1rem' : ''
      this.$refs.rankscroll.$el.style.bottom = bottom
      this.$refs.rankscroll.refresh()
    },
    _getRankList () {
      var that = this
      getRankList().then(response => {
        that.rankList = response.data.topList
      }).catch(error => {
        console.log(error)
      })
    },
    selectRankItem (item) {
      this.setTopList(item)
      this.$router.push(`/rank/${item.id}`)
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="scss">
.rank-list-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 1.5rem;
  bottom: 0;
  background: rgb(226, 255, 252);
  z-index: 100;
  font-size: 0.24rem;
  overflow: hidden;
  .rank-list {
    width: 90%;
    padding: 0.3rem 0 ;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .rank-box {
    margin-bottom: 0.25rem;
    display: flex;
    display: -webkit-flex;
    background-color: #7ff1e7;
    color: #096c64;
    border-radius: 0.05rem;
    width: 100%;
    overflow: hidden;
    justify-content: space-around;
  }
  .left {
    img {
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      margin: 0;
      vertical-align: middle;
    }
  }
  .right {
    margin: 0 0.3rem;
    flex-grow: 2;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      padding: 0;
      margin: 0.1rem 0 0 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
