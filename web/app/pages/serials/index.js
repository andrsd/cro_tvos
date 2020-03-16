import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const SerialsPage = ATV.Page.create({
  name: 'serials',
  template: template,
  ready (options, resolve, reject) {
    ATV.Ajax
      .get(API.url.serials)
      .then((xhrs) => {
        resolve({
          items: xhrs.response.data
        })
      }, (xhrs) => {
        reject()
      })
  }
})

export default SerialsPage
