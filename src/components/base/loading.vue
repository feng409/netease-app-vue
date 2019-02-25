<template>
    <div class="loading-box">
        <img src="../../common/images/loading.gif" class="loading-img" alt="">
        <p>努力加载中...</p>
    </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped lang="scss">
.loading-box {
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 0.24rem;
    color: #757575;
  }
  .loading-img {
    width: 0.32rem;
    height: 0.32rem;
  }
}
</style>
