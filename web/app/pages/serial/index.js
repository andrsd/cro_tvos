import ATV from 'atvjs'
import stripHtml from 'string-strip-html'
import template from './template.hbs'
import errorTpl from 'shared/templates/error.hbs'
import context_menu from './context-menu.hbs'

import API from 'lib/rozhlas.js'
import HB from 'lib/template-helpers.js'
import favorites from 'lib/favorites.js'
import History from 'lib/history.js'
import NowPlayingPage from 'pages/now-playing'

const SerialPage = ATV.Page.create({
  name: 'serial',
  template: template,
  events: {
    highlight: 'onHighlight',
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    let getSerialInfo = API.get(API.url.serial(options.id))
    let getSerialEpisodes = API.get(API.url.serialEpisodes(options.id))

    Promise
      .all([getSerialInfo, getSerialEpisodes])
      .then((xhrs) => {
        this.episodes = {}
        this.serial = xhrs[0].response.data
        for (var e of xhrs[1].response.data) {
          e.watched = History.watched(e.id)
          this.episodes[e.id] = e
        }
        var eps = Object.values(this.episodes)
        eps.sort((a, b) => (a.attributes.part > a.attributes.part) ? 1 : -1)

        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.serial.id)),
          serial: this.serial,
          episodes: eps
        })
      }, (xhrs) => {
        reject()
      })
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var episode = JSON.parse(element.getAttribute("data-href-page-options"))
      var doc = getActiveDocument()
      doc.getElementById('serial-description').innerHTML = stripHtml(episode.attributes.description)
    }
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var episode = JSON.parse(element.getAttribute('data-href-page-options'))
      if (episode.type == 'episode') {
        var doc = ATV.Navigation.presentModal({
          template: context_menu,
          data: {
            episode: episode
          }
        })

        doc
          .getElementById('add-btn')
          .addEventListener('select', () => {
            if (NowPlayingPage.addEpisodeToPlaylist(episode)) {
              ATV.Navigation.dismissModal()
            }
            else {
              ATV.Navigation.dismissModal()
              ATV.Navigation.showError({
                data: {
                  title: 'Chyba',
                  message: 'Nelze přidat do fronty. Epizoda již není dostupná.'
                },
                type: 'document'
              })
            }
          })

        doc
          .getElementById('watched-btn')
          .addEventListener('select', () => {
            History.set(episode.id, 1.0)
            ATV.Navigation.dismissModal()
          })

        doc
          .getElementById('unwatched-btn')
          .addEventListener('select', () => {
            History.remove(episode.id, 0.0)
            ATV.Navigation.dismissModal()
          })
      }
    }
  },
  afterReady (doc) {
    doc
      .getElementById('fav-btn')
      .addEventListener('select', () => {
        if (this.serial) {
          var is_favorite = favorites.change(this.serial.attributes.title, "serial", this.serial.id)
          doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
        }
      })

    doc
      .getElementById('play-serial-btn')
      .addEventListener('select', () => {
        var eps = Object.values(this.episodes)
        eps.sort((a, b) => (a.attributes.part > a.attributes.part) ? -1 : 1)

        for (var episode of eps) {
          NowPlayingPage.addEpisodeToPlaylist(episode)
        }
        NowPlayingPage.play()
      })
  },
  serial: null,
  episodes: {},
})

export default SerialPage
