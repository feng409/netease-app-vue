import Vue from 'vue'
import Router from 'vue-router'
import Recommond from '@/components/recommond'
import Singer from '@/components/singer'
import SingerDetail from '@/components/singerDetail'
import Disc from '@/components/disc'
import RankList from '@/components/rankList'
import TopList from '@/components/topList'
import Search from '@/components/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommond'
    },
    {
      path: '/recommond',
      component: Recommond,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: RankList,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
