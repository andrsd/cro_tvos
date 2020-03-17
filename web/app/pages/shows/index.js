import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const ShowsPage = ATV.Page.create({
  name: 'shows',
  template: template,
  ready (options, resolve, reject) {
    ATV.Ajax
      .get(API.url.shows)
      .then((xhrs) => {
        resolve({
          items: xhrs.response.data
        })
      }, (xhrs) => {
        reject()
      })
  }
})

export default ShowsPage
