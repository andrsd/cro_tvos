import ATV from 'atvjs'
import template from './template.hbs'
import errorTpl from 'shared/templates/error.hbs'

import API from 'lib/rozhlas.js'
import HB from 'lib/template-helpers.js'
import favorites from 'lib/favorites.js'
import History from 'lib/history.js'

const SerialPage = ATV.Page.create({
  name: 'serial',
  template: template,
  events: {
    highlight: 'onHighlight',
    holdselect: 'onHoldSelect'
  },
  ready (options, resolve, reject) {
    let getSerialInfo = ATV.Ajax.get(API.url.serial(options.id))
    let getSerialEpisodes = ATV.Ajax.get(API.url.serialEpisodes(options.id))

    Promise
      .all([getSerialInfo, getSerialEpisodes])
      .then((xhrs) => {
        this.serial = xhrs[0].response.data
        var episodes = {}
        for (var e of xhrs[1].response.data) {
          e.watched = History.watched(e.id)
          episodes[e.id] = e
        }
        var eps = Object.values(episodes)
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
      var ph = element.getElementsByTagName("placeholder").item(0)

      var doc = getActiveDocument()
      doc.getElementById('serial-description').innerHTML = ph.innerHTML
    }
  },
  onHoldSelect(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var episode = JSON.parse(element.getAttribute('data-href-page-options'))
      ATV.Navigation.navigate('episode-context-menu', {
        episode: episode
      })
    }
  },
  afterReady (doc) {
    const changeFavorites = () => {
      if (this.serial) {
        var is_favorite = favorites.change(this.serial.attributes.title, "serial", this.serial.id)
        doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
      }
    }

    doc
      .getElementById('fav-btn')
      .addEventListener('select', changeFavorites)
  },
  serial: null,
})

export default SerialPage
