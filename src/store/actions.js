import * as types from './mutation-types'
import { shuffle } from '../common/js/until'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === 2) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  var randomList = shuffle(list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_MODE, 2)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_SEQUENCE_LIST, list)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit, state}, query) {
  // 获取已存的搜索值
  var history = state.searchHistory.slice()
  // 获取搜索值是否存在历史中，并返回索引
  var index = history.findIndex(function (value, index, arr) {
    return value === query
  })
  if (index < 0) {
    history.unshift(query)
  } else if (index > 0) {
    history.splice(index, 1)
  }
  // 大于15条记录则删掉最后一个
  if (history.length > 15) {
    history.pop()
  }
  window.localStorage.setItem('panda_music_search_key', JSON.stringify(history))
  commit(types.SET_SEARCH_HISTORY, history)
}

export const delectSearch = function ({commit, state}, query) {
  var searchHistory = state.searchHistory.slice()
  var index = searchHistory.findIndex(function (value, index, arr) {
    return value === query
  })
  searchHistory.splice(index, 1)
  window.localStorage.setItem('panda_music_search_key', JSON.stringify(searchHistory))
  commit(types.SET_SEARCH_HISTORY, searchHistory)
}

export const delAllSearchHistory = function ({commit}) {
  window.localStorage.setItem('panda_music_search_key', JSON.stringify([]))
  commit(types.SET_SEARCH_HISTORY, [])
}

export const delectSong = function ({commit, state}, song) {
  var playlist = state.playList.slice()
  var sequenceList = state.sequenceList.slice()
  var currentIndex = state.currentIndex

  var pIndex = playlist.findIndex(function (item) {
    return item.id === song.id
  })
  playlist.splice(pIndex, 1)

  var sIndex = sequenceList.findIndex(function (item) {
    return item.id === song.id
  })
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const delAllSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayList = function ({commit, state}, song) {
  var playHistory = state.playHistory.slice()
  // 获取搜索值是否存在历史中，并返回索引
  var index = playHistory.findIndex(function (value, index, arr) {
    return value === song
  })
  if (index < 0) {
    playHistory.unshift(song)
  } else if (index > 0) {
    playHistory.splice(index, 1)
  }
  // 大于15条记录则删掉最后一个
  if (playHistory.length > 15) {
    playHistory.pop()
  }

  commit(types.SET_PLAY_HISTORY, playHistory)
  window.localStorage.setItem('panda_music_play_list', JSON.stringify(playHistory))
}
