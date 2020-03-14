import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const EpisodePage = ATV.Page.create({
  name: 'episode',
  template: template,
  ready (options, resolve, reject) {
    let getEpisode = ATV.Ajax.get(API.url.episode(options.id), {})
    let getRelatedEpisodes = ATV.Ajax.get(API.url.showEpisodes(options.relationships.show.data.id) + `?page[limit]=10`, {})

    Promise
      .all([getEpisode, getRelatedEpisodes])
      .then((xhrs) => {
        let episode = xhrs[0].response

        var related = []
        for (var r of xhrs[1].response.data) {
          if (r.id != episode.data.id)
            related.push(r)
        }

        resolve({
          episode: episode.data,
          related: related
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default EpisodePage
