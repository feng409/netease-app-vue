<template>
  <div>
    <div class="search-box">
      <img src="../../common/images/search.png" alt="">
      <input :placeholder="placeholder" v-model="query" type="text">
      <img @click="clearQuery" v-show="query" src="../../common/images/close.png" alt="">
    </div>
  </div>
</template>

<script>
import { debounce } from '@/common/js/until'

export default {
  name: 'searchBox',
  data () {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  created () {
    var that = this
    this.$watch('query', debounce((newQuery) => {
      that.$emit('query', newQuery)
    }, 300))
  },
  methods: {
    setQuery (query) {
      this.query = query
    },
    clearQuery () {
      this.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  background-color: #049588;
  width: 90%;
  height: 0.65rem;
  margin: 0.3rem auto;
  border-radius: 0.05rem;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 0.4rem;
    height: 0.4rem;
    padding: 0 0.2rem;
    vertical-align: middle;
  }
  input {
    height: 0.4rem;
    width: 4.5rem;
    background-color: #e2fffc;
    border: 0;
    font-size: 0.24rem;
    padding: 0.1rem;
    box-sizing: border-box;
    color: #096c64;
  }
}
</style>
