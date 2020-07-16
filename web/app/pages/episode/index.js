import ATV from 'atvjs'
import template from './template.hbs'
import NowPlayingPage from 'pages/now-playing'

import API from 'lib/rozhlas.js'

const EpisodePage = ATV.Page.create({
  name: 'episode',
  template: template,
  ready (options, resolve, reject) {
    let getEpisode = API.get(API.url.episode(options.id))
    if ('relationships' in options) {
      let getRelatedEpisodes = API.get(API.url.showEpisodes(options.relationships.show.data.id) + `?page[limit]=10&sort=-since`)

      Promise
        .all([getEpisode, getRelatedEpisodes])
        .then((xhrs) => {
          this.episode = xhrs[0].response.data

          var related = []
          for (var r of xhrs[1].response.data) {
            if (r.id != this.episode.id)
              related.push(r)
          }

          resolve({
            episode: this.episode,
            related: related
          })
        }, (xhr) => {
          // error
          reject()
        })
    }
    else {
      Promise
        .all([getEpisode])
        .then((xhrs) => {
          this.episode = xhrs[0].response.data

          return new API.get(API.url.showEpisodes(this.episode.relationships.show.data.id) + `?page[limit]=10&sort=-since`)
        }, (xhr) => {
          // error
          reject()
        })
        .then((res) => {
          var related = []
          for (var r of res.response.data) {
            if (r.id != this.episode.id)
              related.push(r)
          }

          resolve({
            episode: this.episode,
            related: related
          })
        }, () => {
          reject()
        })
    }
  },
  afterReady (doc) {
    doc
      .getElementById('add-btn')
      .addEventListener('select', () => {
        NowPlayingPage.addEpisodeToPlaylist(this.episode)
      })
  },
  episode: null
})

export default EpisodePage
