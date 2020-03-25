import ATV from 'atvjs'
import template from './template.hbs'
import errorTpl from 'shared/templates/error.hbs'

import API from 'lib/rozhlas.js'
import HB from 'lib/template-helpers.js'
import favorites from 'lib/favorites.js'

const SerialPage = ATV.Page.create({
  name: 'serial',
  template: template,
  events: {
    highlight: 'onHighlight'
  },
  ready (options, resolve, reject) {
    let getSerialInfo = ATV.Ajax.get(API.url.serial(options.id))
    let getSerialEpisodes = ATV.Ajax.get(API.url.serialEpisodes(options.id))

    Promise
      .all([getSerialInfo, getSerialEpisodes])
      .then((xhrs) => {
        this.serial = xhrs[0].response.data

        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.serial.id)),
          serial: this.serial,
          episodes: xhrs[1].response.data
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
  serial: null
})

export default SerialPage
