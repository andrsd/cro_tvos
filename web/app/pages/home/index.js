import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const HomePage = ATV.Page.create({
  name: 'home',
  template: template,
  ready (options, resolve, reject) {
    let getHomePage = ATV.Ajax.get(API.url.homepage)

    var carousel
    var dashboard = []
    var selected = []
    var recommended = []

    ATV.Ajax
      .get(API.url.homepage)
      .then((xhr) => {
        var promises = []

        for (var it of xhr.response.data) {
          if (it.id == 0) {
            var rec_items = []
            for (var jtem of it.attributes.items)
              if (jtem.itemType == "audio")
                rec_items.push(jtem)

            carousel = {
              items: rec_items,
              title: it.attributes.title
            }
          }
          else if (it.id == 9) {
            for (var jtem of it.attributes.items)
            {
              if (jtem.dashboardType == 'dashboard_topic') {
                var url = API.url.entityUrl(jtem.attributes.entity)
                promises.push(
                  ATV.Ajax
                    .get(url)
                    .then((xhr) => {
                      dashboard.push(xhr.response.data)
                      return true
                    }, () => {
                      return true
                    })
                )
              }
            }
          }
          else if (it.id == 83) {
          }
          else if (it.id == 3) {
            for (var entity of it.attributes.entities) {
              var url = API.url.entityUrl(entity)

              if (url != null) {
                promises.push(
                  ATV.Ajax
                    .get(url)
                    .then((xhr) => {
                      recommended.push(xhr.response.data)
                      return true
                    }, () => {
                      return true
                    })
                )
              }
            }
          }
        }

        return Promise.all(promises)
      }, (xhr) => {
        reject()
      })
      .then(() => {
        resolve({
          carousel: carousel,
          dashboard: dashboard,
          selected: selected,
          recommended: recommended
        })
      }, () => {
        ATV.Navigation.showError({
          data: {
            title: 'Hovno',
            message: 'Nic nebude'
          },
          type: 'document'
        })
      })
  }
})

export default HomePage
