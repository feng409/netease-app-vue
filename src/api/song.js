import axios from 'axios'
import {Base64} from 'js-base64'

export function getSongLyric (mid) {
  var url = '/api/getSongLyric'
  var data = {
    pcachetime: '1521953278523',
    songmid: mid,
    g_tk: '1863053334',
    loginUin: '853569768',
    hostUin: 0,
    format: 'jsonp',
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
      var ret = response.data
      if (typeof ret === 'string') {
        var reg = /^\w+\(({[^()]+})\)$/
        var matches = ret.match(reg)
        if (matches) {
          ret = JSON.parse(matches[1])
        }
      }
      if (ret.retcode === 0) {
        var res = Base64.decode(ret.lyric)
        resolve(res)
      } else {
        reject('noLyric')
      }
    })
  })
}
