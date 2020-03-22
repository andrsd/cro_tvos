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
    select: 'onSelect',
    highlight: 'onHighlight'
  },
  ready (options, resolve, reject) {
    let getSerialInfo = ATV.Ajax.get(API.url.serial(options.id))
    let getSerialEpisodes = ATV.Ajax.get(API.url.serialEpisodes(options.id))

    Promise
      .all([getSerialInfo, getSerialEpisodes])
      .then((xhrs) => {
        this.serial = xhrs[0].response.data

        for (var s of xhrs[1].response.data) {
          this.episodes[s.id] = s
        }

        resolve({
          ratedButton: favorites.getRatedButton(favorites.isFavorite(this.serial.id)),
          info: this.serial,
          episodes: xhrs[1].response.data
        })
      }, (xhrs) => {
        reject()
      })
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName.toLowerCase()

    if (elementType === 'lockup') {
      var episode_id = element.getAttribute("id")
      var attrs = this.episodes[episode_id].attributes

      var doc = getActiveDocument()
      doc.getElementById('ep-title').textContent = attrs.title
      doc.getElementById('ep-part').textContent = attrs.part + ". díl"
      doc.getElementById('ep-description').textContent = HB.helpers.removeHTML(attrs.description)
      doc.getElementById('ep-run-time').textContent = HB.helpers.timeLength(attrs.since, attrs.till)
      doc.getElementById('ep-date').textContent = HB.helpers.longDate(attrs.since)

      this.active_episode_id = episode_id
    }
  },
  onSelect(e) {
    let element = e.target
    let elementType = element.nodeName.toLowerCase()
    var id = element.getAttribute("id")

    if (id == 'play-btn' || elementType === 'lockup') {
      ATV.Navigation.navigate('play-episode', this.episodes[this.active_episode_id])
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
  episodes: {},
  active_episode_id: null,
  serial: null
})

export default SerialPage
