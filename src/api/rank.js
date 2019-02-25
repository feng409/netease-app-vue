import jsonp from 'jsonp'
import axios from 'axios'

export function getRankList () {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
  var option = {
    param: 'jsonpCallback'
  }
  return new Promise((resolve, reject) => {
    jsonp(url, option, (error, response) => {
      if (!error) {
        resolve(response)
      } else {
        reject(error)
      }
    })
  })
}

export function getTopLists (topId) {
  var url = '/api/getTopList'
  var data = {
    g_tk: '1928093487',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    topid: 4,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  }
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then(response => {
      resolve(response.data)
    })
  })
}
