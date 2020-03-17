import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const ShowsPage = ATV.Page.create({
  name: 'shows',
  template: template,
  ready (options, resolve, reject) {
    let url
    if (options && 'next' in options)
      url = options.next
    else
      url = API.url.shows

    ATV.Ajax
      .get(url)
      .then((xhrs) => {
        resolve({
          items: xhrs.response.data,
          links: xhrs.response.links
        })
      }, (xhrs) => {
        reject()
      })
  }
})

export default ShowsPage
