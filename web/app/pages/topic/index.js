import ATV from 'atvjs'
import template from './template.hbs'
import storiesTpl from './stories.hbs'

import API from 'lib/rozhlas.js'

const TopicPage = ATV.Page.create({
  name: 'topic',
  template: template,
  ready (options, resolve, reject) {
    if (options.id == '671d0806-2afe-4282-ae90-319b6ef369a2') {
      // hry, cetby a povidky
      this.template = storiesTpl
      this.playsReadingsStories(options, resolve, reject)
    }
    else {
      this.template = template
      this.commonTopic(options, resolve, reject)
    }
  },
  commonTopic (options, resolve, reject) {
    let getTopic = ATV.Ajax.get(API.url.topic(options.id), {})

    Promise
      .all([getTopic])
      .then((xhrs) => {
        var data = xhrs[0].response.data
        var obj = {}

        obj.attributes = data.attributes

        for (var widget of data.attributes.widgets) {
          if (widget.type == 'carousel') {
            obj.carousel = []
            for (var i of widget.attributes.items) {
              if (i.itemType == 'audio')
                obj.carousel.push(i)
            }
          }
          else if (widget.type == 'shows_list') {
            obj.shows = []
            for (var i of widget.attributes.entities) {
              if (i.type == 'show')
                obj.shows.push(i)
            }
          }
          else if (widget.type == 'episodes_list') {
            obj.episodes = []
            for (var ep of widget.attributes.entities) {
              if (ep.type == 'episode')
                obj.episodes.push(ep)
            }
          }
        }

        resolve(obj)
      }, (xhr) => {
        // error
        reject()
      })
  },
  playsReadingsStories(options, resolve, reject) {
    let getTopic = ATV.Ajax.get(API.url.topic(options.id), {})

    Promise
      .all([getTopic])
      .then((xhrs) => {
        var data = xhrs[0].response.data
        var obj = {}

        obj.attributes = data.attributes
        obj.sections = []

        for (var widget of data.attributes.widgets) {
          if (widget.type == 'carousel') {
            obj.sections.push(widget.attributes)
          }
        }

        resolve(obj)
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default TopicPage
