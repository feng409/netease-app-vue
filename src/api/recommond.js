import jsonp from 'jsonp'
import axios from 'axios'
// import qs from 'qs'
// import Vue from 'vue'

export function getSliderList () {
  var url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1521098987977'
  var option = {
    param: 'jsonpCallback'
  }
  return new Promise((resolve, reject) => {
    jsonp(url, option, function (error, response) {
      if (!error) {
        resolve(response)
      } else {
        reject(error)
      }
    })
  })
}

// export function set () {
//   Vue.cookie.set('test', 'Hello world!', 1)
//   console.log(Vue.cookie.get('test'))
// }

export function getMusicuList () {
  var url = '/api/getMusicuList'
  var data = {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  }
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then(response => {
      resolve(response.data)
    })
  })
}

export function getSongList (disstId) {
  var url = '/api/getSongList'
  var data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disstId,
    format: 'json',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then(response => {
      resolve(response.data)
    })
  })
}
