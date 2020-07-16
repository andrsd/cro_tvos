import ATV from 'atvjs'
import template from './template.hbs'
import context_menu from './context-menu.hbs'

import API from 'lib/rozhlas.js'
import favorites from 'lib/favorites.js'
import History from 'lib/history.js'
import NowPlayingPage from 'pages/now-playing'

const ShowPage = ATV.Page.create({
  name: 'show',
  template: template,
  events: {
    highlight: 'onHighlight',
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    let getShow
    let getShowEpisodes
    let getShowSerials
    if (options && 'next' in options) {
      var result = options.next.match("shows\/(.+)\/episodes")
      getShow = ATV.Ajax.get(API.url.show(result[1]))
      getShowEpisodes = ATV.Ajax.get(options.next)
      getShowSerials = ATV.Ajax.get(API.url.showSerials(result[1]))
    }
    else {
      var show_id = options.id
      getShow = ATV.Ajax.get(API.url.show(show_id))
      getShowEpisodes = ATV.Ajax.get(API.url.showEpisodes(show_id) + `?page[limit]=10&sort=-since`)
      getShowSerials = ATV.Ajax.get(API.url.showSerials(show_id))
    }

    Promise
      .all([getShow, getShowEpisodes, getShowSerials])
      .then((xhrs) => {
        this.show = xhrs[0].response.data
        var episodes = {}
        for (var e of xhrs[1].response.data) {
          e.watched = History.watched(e.id)
          episodes[e.id] = e
        }

        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.show.id)),
          show: xhrs[0].response.data,
          episodes: Object.values(episodes),
          links: xhrs[1].response.links,
          serials: xhrs[2].response.data
        })
      }, (xhr) => {
        // error
        reject()
      })
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var ph = element.getElementsByTagName("placeholder").item(0)

      var doc = getActiveDocument()
      doc.getElementById('show-description').innerHTML = ph.innerHTML
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
        if (this.show) {
          var is_favorite = favorites.change(this.show.attributes.title, 'show', this.show.id)
          doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
        }
      })
  },
  show: null
})

export default ShowPage
