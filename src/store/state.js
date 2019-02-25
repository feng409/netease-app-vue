const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

function getSearchHistory () {
  var searchHistory = window.localStorage.getItem('panda_music_search_key') ? JSON.parse(window.localStorage.getItem('panda_music_search_key')) : []
  return searchHistory
}

function getPlayHistory () {
  var playHistory = window.localStorage.getItem('panda_music_play_list') ? JSON.parse(window.localStorage.getItem('panda_music_play_list')) : []
  return playHistory
}

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: getSearchHistory(),
  playHistory: getPlayHistory()
}
export default state
