import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'
import favorites from 'lib/favorites.js'
import History from 'lib/history.js'

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
    if (options && 'next' in options) {
      var result = options.next.match("shows\/(.+)\/episodes")
      getShow = ATV.Ajax.get(API.url.show(result[1]))
      getShowEpisodes = ATV.Ajax.get(options.next)
    }
    else {
      var show_id = options.id
      getShow = ATV.Ajax.get(API.url.show(show_id))
      getShowEpisodes = ATV.Ajax.get(API.url.showEpisodes(show_id) + `?page[limit]=10&sort=-since`)
    }

    Promise
      .all([getShow, getShowEpisodes])
      .then((xhrs) => {
        this.show = xhrs[0].response.data
        this.episodes = {}
        for (var e of xhrs[1].response.data) {
          e.watched = History.watched(e.id)
          this.episodes[e.id] = e
        }
        var serials = null
        if (this.show.relationships.serials.data.length > 0)
          serials = this.show.relationships.serials.data.length

        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.show.id)),
          show: xhrs[0].response.data,
          episodes: Object.values(this.episodes),
          links: xhrs[1].response.links,
          serials: serials
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

      var id = element.getAttribute('id')
      this.currentEpisodeId = id
    }
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var id = element.getAttribute('id')
      ATV.Navigation.navigate('episode-context-menu', {
        episode: this.episodes[this.currentEpisodeId]
      })
    }
  },
  afterReady (doc) {
    const changeFavorites = () => {
      if (this.show) {
        var is_favorite = favorites.change(this.show.attributes.title, 'show', this.show.id)
        doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
      }
    }

    doc
      .getElementById('fav-btn')
      .addEventListener('select', changeFavorites)

    const onShowSerials = () => {
      ATV.Navigation.navigate('show-serials', this.show)
    }
    var serials_btn = doc.getElementById('serials-btn')
    if (serials_btn)
      serials_btn.addEventListener('select', onShowSerials)
  },
  show: null,
  episodes: {},
  currentEpisodeId: null
})

export default ShowPage
