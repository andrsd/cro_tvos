import ATV from 'atvjs'
import template from './template.hbs'
import descr_templ from './descr.hbs'
import NowPlayingPage from 'pages/now-playing'

import API from 'lib/rozhlas.js'
import favorites from 'lib/favorites.js'

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
          if (this.episode.relationships.show.data.id)
            this.show_button = true

          var related = []
          for (var r of xhrs[1].response.data) {
            if (r.id != this.episode.id)
              related.push(r)
          }

          resolve({
            episode: this.episode,
            related: related,
            ratedButton: favorites.getRatedButton(favorites.isFavorite(this.episode.id)),
            show_button: this.show_button
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
          if (this.episode.relationships.show.data.id)
            this.show_button = true

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
            related: related,
            ratedButton: favorites.getRatedButton(favorites.isFavorite(this.episode.id)),
            show_button: this.show_button
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
    if (this.show_button)
      doc
        .getElementById('to-show-btn')
        .addEventListener('select', () => {
          ATV.Navigation.navigate('show', { id: this.episode.relationships.show.data.id })
        })
    doc
      .getElementById('fav-btn')
      .addEventListener('select', () => {
        if (this.episode) {
          var is_favorite = favorites.change(this.episode.attributes.title, "episode", this.episode.id)
          doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
        }
      })

    doc
      .getElementById('descr')
      .addEventListener('select', () => {
        var ctx_doc = ATV.Navigation.presentModal({
          template: descr_templ,
          data: {
            title: this.episode.attributes.title,
            text: this.episode.attributes.description
          }
        })

        ctx_doc
          .getElementById('dismiss-btn')
          .addEventListener('select', () => {
            ATV.Navigation.dismissModal()
          })
      })
  },
  episode: null,
  show_button: null
})

export default EpisodePage
