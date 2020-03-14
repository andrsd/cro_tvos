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

        resolve({
          show: xhrs[0].response.data,
          episodes: xhrs[1].response.data
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default ShowPage
