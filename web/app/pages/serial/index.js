import ATV from 'atvjs'
import template from './template.hbs'
import errorTpl from 'shared/templates/error.hbs'

import API from 'lib/rozhlas.js'
import HB from 'lib/template-helpers.js'

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
        for (var s of xhrs[1].response.data) {
          this.episodes[s.id] = s
        }

        resolve({
          info: xhrs[0].response.data,
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
  episodes: {},
  active_episode_id: null
})

export default SerialPage
