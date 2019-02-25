<template>
  <div id="app" style="background: #e2fffc;">
    <mine-header></mine-header>
    <player></player>
    <router-view/>
  </div>
</template>

<script>
import MineHeader from '@/components/base/header'
import Player from '@/components/player'

export default {
  components: {
    MineHeader,
    Player
  }
}
</script>

<style>
</style>
