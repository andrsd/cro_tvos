import ATV from 'atvjs'
import stripHtml from 'string-strip-html'
import template from './template.hbs'
import storiesTpl from './stories.hbs'

import API from 'lib/rozhlas.js'
import favorites from 'lib/favorites.js'
import History from 'lib/history.js'

const TopicPage = ATV.Page.create({
  name: 'topic',
  template: template,
  events: {
    highlight: 'onHighlight'
  },
  ready (options, resolve, reject) {
    if (Object.values(API.ids).includes(options.id)) {
      this.template = storiesTpl
      this.playsReadingsStories(options, resolve, reject)
    }
    else {
      this.template = template
      this.commonTopic(options, resolve, reject)
    }
  },
  commonTopic (options, resolve, reject) {
    let getTopic = API.get(API.url.topic(options.id))

    Promise
      .all([getTopic])
      .then((xhrs) => {
        var data = xhrs[0].response.data
        var carousel = []
        var episodes = []
        this.topic = {
          id: data.id,
          attributes: data.attributes
        }

        var ratedButton = favorites.getRatedButton(favorites.isFavorite(this.topic.id))

        for (var widget of data.attributes.widgets) {
          if (widget.type == 'carousel') {
            for (var i of widget.attributes.items) {
              if (i.itemType == 'audio') {
                var show = i
                show.id = i.entity.id
                carousel.push(show)
              }
            }
          }
          else if (widget.type == 'episodes_list') {
            for (var ep of widget.attributes.entities) {
              if (ep.type == 'episode') {
                ep.watched = History.watched(ep.id)
                episodes.push(ep)
              }
            }
          }
        }

        resolve({
          carousel: carousel,
          episodes: episodes,
          ratedButton: ratedButton,
          topic: this.topic
        })
      }, (xhr) => {
        // error
        reject()
      })
  },
  playsReadingsStories(options, resolve, reject) {
    let getTopic = API.get(API.url.topic(options.id))

    Promise
      .all([getTopic])
      .then((xhrs) => {
        var data = xhrs[0].response.data

        this.topic = {
          id: data.id,
          attributes: data.attributes
        }

        var obj = {}

        obj.attributes = data.attributes
        obj.sections = []
        obj.ratedButton = favorites.getRatedButton(favorites.isFavorite(this.topic.id))

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
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var page = element.getAttribute("data-href-page")
      var data = JSON.parse(element.getAttribute("data-href-page-options"))
      var doc = getActiveDocument()
      if (doc.getElementById('description')) {
        if (page == "episode") {
          doc.getElementById('description').innerHTML = stripHtml(data.attributes.description)
        }
        else if (page == "show") {
          doc.getElementById('description').innerHTML = stripHtml(data.description)
        }
      }
    }
  },
  afterReady (doc) {
    if (doc.getElementById('fav-btn'))
      doc
        .getElementById('fav-btn')
        .addEventListener('select', () => {
          if (this.topic) {
            var is_favorite = favorites.change(this.topic.attributes.title, 'topic', this.topic.id)
            doc.getElementById('fav-btn').innerHTML = favorites.getRatedButton(is_favorite)
          }
        })
  },
  topic: null,
  episodes: null,
})

export default TopicPage
