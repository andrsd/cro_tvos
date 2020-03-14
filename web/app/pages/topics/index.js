import ATV from 'atvjs'
import template from './template.hbs'
import episodesTpl from './episodes.hbs'

import API from 'lib/rozhlas.js'

const TopicsPage = ATV.Page.create({
  name: 'topics',
  template: template,
  events: {
    highlight: 'onHighlight'
  },
  episodes_loaded: {},
  ready (options, resolve, reject) {
    let getTopics = ATV.Ajax.get(API.url.topics, {})

    Promise
      .all([getTopics])
      .then((xhrs) => {
        let res = xhrs[0].response

        var topics = []
        for (var s of res.data) {
          topics.push({
            id: s.id,
            title: s.attributes.title
          })
          this.episodes_loaded[s.id] = false
        }

        resolve({
          topics: topics
        })
      }, (xhr) => {
        // error
        reject()
      })
  },
  onHighlight(e) {
    let element = e.target
    let elementType = element.nodeName.toLowerCase()

    if (elementType === 'listitemlockup') {
        this.loadEpisodes(element)
    }
  },
  loadEpisodes (element) {
    var topic_id = element.getAttribute("id")

    var doc = getActiveDocument()
    // Create parser and new input element
    var domImplementation = doc.implementation
    var lsParser = domImplementation.createLSParser(1, null)
    var lsInput = domImplementation.createLSInput()

    let getTopicEpisodes = ATV.Ajax.get(API.url.topicEpisodes(topic_id), {})

    Promise
      .all([getTopicEpisodes])
      .then((xhrs) => {
        let results = xhrs[0].response

        var episodes = []
        for (var r of results.data) {
          episodes.push(r)
        }

        //overwrite stringData for new input element if search results exist by dynamically constructing shelf template fragment
        lsInput.stringData = episodesTpl({
          episodes: episodes
        })

        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, element.getElementsByTagName("relatedContent").item(0), 2)

        this.episodes_loaded[topic_id] = true
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default TopicsPage
