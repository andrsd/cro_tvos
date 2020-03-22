import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const FavoritesPage = ATV.Page.create({
  name: 'favorites',
  template: template,
  ready (options, resolve, reject) {
    let favorites = ATV.Settings.get('favorites')

    if (favorites !== undefined) {
      var promises = []

      // Issue a request for each show and then parse into JSON
      favorites.forEach((value) => {
        promises.push(
          ATV.Ajax
            .get(API.url.entityUrl(value))
            .then((xhr) => {
              value.attributes = xhr.response.data.attributes
            }))
      })

      // After all requests are done
      Promise
        .all(promises)
        .then(() => {
          resolve({
            favorites: favorites
          })
        }, (xhr) => {
          // error
          reject(xhr)
        })
    }
    else {
      resolve()
    }
  }
})

export default FavoritesPage
