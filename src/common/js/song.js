export class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong (item) {
  var key = 'DBB03BEC92A3E7EB9A1FEB41FB583E4F74275FA38E63C12DE3351702907860A3C6DB74DC077EDC01B7B5A16371AC8C550A7A1C2A6BF54AAE'
  return {
    album: item.albumname,
    duration: item.interval,
    id: item.songid,
    imageUrl: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + item.albummid + '.jpg?max_age=2592000',
    mid: item.songmid,
    name: item.songname,
    singer: item.singer[0].name,
    url: 'http://dl.stream.qqmusic.qq.com/C400' + item.songmid + '.m4a?guid=9595680710&vkey=' + key + '&uin=0&uin=0&fromtag=38'
  }
}
