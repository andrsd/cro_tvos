import ATV from 'atvjs'
import template from './template.hbs'
import API from 'lib/rozhlas.js'
import History from 'lib/history.js'
import NowPlayingPage from 'pages/now-playing'

const EpisodeContextMenuPage = ATV.Page.create({
  name: 'episode-context-menu',
  template: template,
  ready (options, resolve, reject) {
    this.episode = options.episode
    resolve({
      episode: this.episode
    })
  },
  afterReady (doc) {
    const addToQueue = () => {
      NowPlayingPage.addEpisodeToPlaylist(this.episode)
    }
    doc
      .getElementById('add-btn')
      .addEventListener('select', addToQueue)

    const markAsWatched = () => {
      History.set(this.episode.id, 1.0)
      ATV.Navigation.back()
    }
    doc
      .getElementById('watched-btn')
      .addEventListener('select', markAsWatched)

    const markAsUnwatched = () => {
      History.remove(this.episode.id, 0.0)
      ATV.Navigation.back()
    }
    doc
      .getElementById('unwatched-btn')
      .addEventListener('select', markAsUnwatched)
  },
  episode: null
})

export default EpisodeContextMenuPage
