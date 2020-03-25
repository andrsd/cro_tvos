import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'
import favorites from 'lib/favorites.js'

const ShowPage = ATV.Page.create({
  name: 'show',
  template: template,
  events: {
    highlight: 'onHighlight'
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
      getShowEpisodes = ATV.Ajax.get(API.url.showEpisodes(show_id) + `?sort=-since`)
    }

    Promise
      .all([getShow, getShowEpisodes])
      .then((xhrs) => {
        this.show = xhrs[0].response.data
        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.show.id)),
          show: xhrs[0].response.data,
          episodes: xhrs[1].response.data,
          links: xhrs[1].response.links
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
  },
  show: null
})

export default ShowPage
