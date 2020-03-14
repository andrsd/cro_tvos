import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const ShowPage = ATV.Page.create({
  name: 'show',
  template: template,
  ready (options, resolve, reject) {
    var show_id = options.id
    let getShow = ATV.Ajax.get(API.url.show(show_id), {})
    let getShowEpisodes = ATV.Ajax.get(API.url.showEpisodes(show_id) + `?sort=-since`, {})

    Promise
      .all([getShow, getShowEpisodes])
      .then((xhrs) => {
        var episodes = []

        for (var ep of xhrs[1].response.data) {
          var e = ep
          e.attributes.length = API.episode_time(ep.attributes.since, ep.attributes.till)
          episodes.push(e)
        }

        resolve({
          show: xhrs[0].response.data,
          episodes: episodes
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default ShowPage
