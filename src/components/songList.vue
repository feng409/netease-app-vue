<template>
  <div class="song-list-container">
    <ul>
      <li @click="selectItem(item, index)" v-for="(item, index) in songs" :key="index">
        <p v-show="rank" :class="getRankCls(index)" v-text="getRankText(index)"></p>
        <div style="flex-grow: 1;width: 0;">
          <p>{{ item.name }}</p>
          <p class="name">{{ item.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default () {
        return { songs: [] }
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('selectItem', item, index)
    },
    getRankCls (index) {
      if (index <= 2) {
        return 'rankIcon' + index
      } else {
        return 'text'
      }
    },
    getRankText (index) {
      if (index >= 3) {
        return index
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.song-list-container {
  font-size: 0.24rem;
  width: 85%;
  color: #049588;
  margin: 0.4rem auto;
  .rankIcon0, .rankIcon1, .rankIcon2{
    width: 0.5rem;
    height: 0.48rem;
    padding-right: 0.3rem;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .rankIcon0 {
    background-image: url('../common/images/rank/first.png')
  }
  .rankIcon1 {
    background-image: url('../common/images/rank/second.png')
  }
  .rankIcon2 {
    background-image: url('../common/images/rank/third.png')
  }
  .text {
    width: 0.5rem;
    height: 0.48rem;
    padding-right: 0.3rem;
    text-align: center;
    font-size: 0.3rem;
    color: #d7403b;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding: 0;
      margin: 0;
      padding-bottom: 0.2rem;

      display: flex;
      display: -webkit-flex;
    }
    p {
      padding: 0;
      margin: 0;
      padding-bottom: 0.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name {
      color: #606060;
    }
  }
}
</style>
