import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const ShowSerialsPage = ATV.Page.create({
  name: 'show-serials',
  template: template,
  ready (options, resolve, reject) {
    var show_id = options.id
    let getShow = ATV.Ajax.get(API.url.show(show_id))
    let getShowSerials = ATV.Ajax.get(API.url.showSerials(show_id))
    let getShowParticipants = ATV.Ajax.get(API.url.showParticipants(show_id))

    Promise
      .all([getShow, getShowSerials, getShowParticipants])
      .then((xhrs) => {
        // var roles = {}
        // for (var p of xhrs[0].response.data.relationships.participants.data) {
        //   roles[p.id] = p.meta.role
        // }

        resolve({
          show: xhrs[0].response.data,
          serials: xhrs[1].response.data,
          participants: xhrs[2].response.data
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default ShowSerialsPage
