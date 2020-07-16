import ATV from 'atvjs'
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
    if (options.id == '671d0806-2afe-4282-ae90-319b6ef369a2' ||  // hry, cetby a povidky
        options.id == '8ed08518-9d92-437c-a96f-e5df046aff4e')    // pro deti
    {
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
              if (i.itemType == 'audio')
                carousel.push(i)
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
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName

    if (elementType === 'listItemLockup') {
      var ph = element.getElementsByTagName("placeholder").item(0)

      var doc = getActiveDocument()
      doc.getElementById('show-description').innerHTML = ph.innerHTML
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
