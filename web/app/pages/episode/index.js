import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const EpisodePage = ATV.Page.create({
  name: 'episode',
  template: template,
  ready (options, resolve, reject) {
    let getEpisode = ATV.Ajax.get(API.url.episode(options.id), {})
    if ('relationships' in options) {
      let getRelatedEpisodes = ATV.Ajax.get(API.url.showEpisodes(options.relationships.show.data.id) + `?page[limit]=10`, {})

      Promise
        .all([getEpisode, getRelatedEpisodes])
        .then((xhrs) => {
          let e = xhrs[0].response.data

          var episode = e
          episode.attributes.length = API.episode_time(episode.attributes.since, episode.attributes.till)

          var related = []
          for (var r of xhrs[1].response.data) {
            if (r.id != episode.id)
              related.push(r)
          }

          resolve({
            episode: episode,
            related: related
          })
        }, (xhr) => {
          // error
          reject()
        })
    }
    else {
      Promise
        .all([getEpisode])
        .then((xhrs) => {
          let e = xhrs[0].response.data

          var episode = e
          episode.attributes.length = API.episode_time(episode.attributes.since, episode.attributes.till)

          resolve({
            episode: episode
          })
        }, (xhr) => {
          // error
          reject()
        })
    }
  }
})

export default EpisodePage
