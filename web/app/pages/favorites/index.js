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
          API
            .get(API.url.entityUrl(value))
            .then((xhr) => {
              value.attributes = xhr.response.data.attributes
            }))
      })

      // After all requests are done
      Promise
        .all(promises)
        .then(() => {
          var shows = []
          var serials = []
          var topics = []
          var episodes = []

          for (var f of favorites) {
            if (f.type == 'show')
              shows.push(f)
            else if (f.type == 'serial')
              serials.push(f)
            else if (f.type == 'topic')
              topics.push(f)
            else if (f.type == 'episode')
              episodes.push(f)
          }

          if (shows.length > 0 || serials.length > 0 || topics.length > 0 || episodes.length > 0) {
            resolve({
              favorites: {
                shows: shows,
                serials: serials,
                topics: topics,
                episodes: episodes,
              }
            })
          }
          else
            resolve({})
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
