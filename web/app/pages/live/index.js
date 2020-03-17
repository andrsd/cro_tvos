import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const LivePage = ATV.Page.create({
  name: 'stations',
  template: template,
  ready (options, resolve, reject) {
    let getStations = ATV.Ajax.get(API.url.stations, {})
    let getCurrentSchedule = ATV.Ajax.get(API.url.scheduleCurrent, {})

    Promise
      .all([getStations, getCurrentSchedule])
      .then((xhrs) => {
        let stations = xhrs[0].response
        let current_schedule = xhrs[1].response

        var all = {}
        for (var s of stations.data) {
          all[s.id] = {
            id: s.id,
            stationName: s.attributes.shortTitle,
            stationType: s.attributes.stationType,
            stationCode: s.attributes.code,
            stationImage: s.attributes.asset.url
          }
        }

        var now = new Date()
        for (var s of current_schedule.data) {
          var since = Date.parse(s.attributes.since)
          var till = Date.parse(s.attributes.till)
          if (since <= now && now < till) {
            var station_id = s.relationships.station.data.id
            all[station_id].showTitle = s.attributes.mirroredShow.title
            all[station_id].progress = (now - since) / (till - since)
            if (s.attributes.asset.url == undefined)
              all[station_id].image = all[station_id].stationImage
            else
              all[station_id].image = s.attributes.asset.url
          }
        }

        var allovers = []
        var regionals = []
        var foreigns = []
        for (var key in all) {
          var a = all[key]
          if (a.stationType == 'allover')
            allovers.push(a)
          else if (a.stationType == 'regional')
            regionals.push(a)
          else if (a.stationType == 'abroad')
            foreigns.push(a)
        }

        resolve({
          allover: allovers,
          regional: regionals,
          foreign: foreigns
        })
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default LivePage
