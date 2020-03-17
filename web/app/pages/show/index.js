import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const ShowPage = ATV.Page.create({
  name: 'show',
  template: template,
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
        var episodes = []

        for (var ep of xhrs[1].response.data) {
          var e = ep
          e.attributes.length = API.episode_time(ep.attributes.since, ep.attributes.till)
          episodes.push(e)
        }

        resolve({
          show: xhrs[0].response.data,
          episodes: episodes,
          links: xhrs[1].response.links
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default ShowPage
