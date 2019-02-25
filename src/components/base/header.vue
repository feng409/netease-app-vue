<template>
  <div class="mine-header">
      <div class="top-header">
          <img class="app-icon-img" src="../../common/images/app-icon.png" alt="">
          <span>Panda Music</span>
      </div>
      <div class="top-tab">
          <ul>
              <router-link tag="li" to="/recommond" active-class="tab-active">推荐</router-link>
              <router-link tag="li" to="/singer" active-class="tab-active">歌手</router-link>
              <router-link tag="li" to="/rank" active-class="tab-active">排行</router-link>
              <router-link tag="li" to="/search" active-class="tab-active">搜索</router-link>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  @import '../../common/styles/base';
  .mine-header {
      background: $theme-color;
      color: #fff;
      font-size: $page-base-font;
      .top-header {
            background: $theme-color;
            height: 0.9rem;
            text-align: center;
            line-height: 0.9rem;
      }
      .top-tab {
          height: 0.6rem;
          ul {
              list-style-type: none;
              margin: 0;
              line-height: 0.6rem;
              padding: 0;
              background: #20b5a8;
              color: #ecdd50;
              display: flex;
              justify-content: space-around;
              text-align: center;
          }
          li {
              display: inline-block;
              width: 25%;
          }
          .tab-active {
              background: #066d64 !important;
          }
      }
  }
</style>
