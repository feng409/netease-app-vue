import jsonp from 'jsonp'

export function gethotkey () {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
  var option = {
    param: 'jsonpCallback'
  }
  return new Promise((resolve, reject) => {
    jsonp(url, option, function (error, response) {
      if (!error) {
        resolve(response.data)
      } else {
        reject(error)
      }
    })
  })
}

export function getSearchList (query, page, zhida, perpage) {
  var url = '/api/searchSong?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&w=' + query + '&p=' + page + '&perpage=' + perpage + '&n=20&catZhida=' + zhida + '&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5'
  var option = {
    param: 'jsonpCallback'
  }
  return new Promise((resolve, reject) => {
    jsonp(url, option, function (error, response) {
      if (!error) {
        resolve(response.data)
      } else {
        reject(error)
      }
    })
  })
}
