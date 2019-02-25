import jsonp from 'jsonp'

export function getSingerDeatil (id) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&singermid=' + id + '&order=listen&begin=0&num=30&songstatus=1'
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
