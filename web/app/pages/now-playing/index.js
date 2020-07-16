import ATV from 'atvjs'
import template from './template.hbs'
import HB from 'lib/template-helpers.js'
import History from 'lib/history.js'

var player = new Player()
var playlist = new Playlist()
var episode_id = null

const NowPlayingPage = ATV.Page.create({
  name: 'now-playing',
  template: template,
  ready (options, resolve, reject) {
    this.init()

    if (options) {
      var mediaItem = this.buildMediaItem(options)
      if (mediaItem) {
        episode_id = mediaItem.id
        History.set(episode_id, 0.5)

        player.playlist = new Playlist()
        player.playlist.push(mediaItem)
        player.play()
        resolve(false)
      }
      else {
        ATV.Navigation.showError({
          data: {
            title: 'Chyba',
            message: 'Nelze přehrát. Epizoda již není dostupná.'
          },
          type: 'document'
        })
      }
    }
    else {
      if (player.playlist.length > 0)
        player.present()

      resolve(true)
    }
  },
  afterReady (doc) {
  },
  onSelect(e) {
  },
  onHighlight(e) {
  },
  buildMediaItem(episode) {
    if (episode.attributes.audioLinks.length > 0) {
      var bitrate = 0
      let url = null
      for (var al of episode.attributes.audioLinks) {
        if (al.variant == 'mp3' && al.linkType == "download" && al.bitrate > bitrate) {
          bitrate = al.bitrate
          url = al.url
        }
      }

      if (url) {
        var mediaItem = new MediaItem('audio', url)
        mediaItem.id = episode.id
        mediaItem.title = episode.attributes.title
        if (episode.attributes.part)
          mediaItem.title += ` (${episode.attributes.part}. díl)`
        mediaItem.description = HB.helpers.removeHTML(episode.attributes.description)
        if (typeof episode.attributes.asset != 'undefined' &&
            typeof episode.attributes.asset.url != 'undefined')
          mediaItem.artworkImageURL = episode.attributes.asset.url
        return mediaItem
      }
      else
        return null
    }
    else
      return null
  },
  addEpisodeToPlaylist(episode) {
    this.init()

    var mediaItem = this.buildMediaItem(episode)
    if (mediaItem) {
      player.playlist.push(mediaItem)
      return true
    }
    else {
      return false
    }
  },
  init() {
    if (player.playlist == null) {
      player.playlist = playlist
      player.addEventListener('mediaItemWillChange', function(e) {
        History.set(episode_id, 1.)
      })
      player.addEventListener('mediaItemDidChange', function(e) {
        if (player && player.currentMediaItem) {
          episode_id = player.currentMediaItem.id
          History.set(episode_id, 0.5)
        }
      })
      player.addEventListener('stateDidChange', function(stateObj) {
        if (stateObj.state == 'end') {
          History.set(episode_id, 1.)
        }
      })
    }
  },
  play() {
    player.play()
  }
})


export default NowPlayingPage
