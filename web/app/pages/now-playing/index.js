import ATV from 'atvjs'
import template from './template.hbs'
import HB from 'lib/template-helpers.js'

var player = new Player()
var playlist = new Playlist()

const NowPlayingPage = ATV.Page.create({
  name: 'now-playing',
  template: template,
  ready (options, resolve, reject) {
    this.init()

    if (options) {
      var mediaItem = this.buildMediaItem(options)
      if (mediaItem) {
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
        const mediaItem = new MediaItem('audio', url)
        mediaItem.title = episode.attributes.title
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
      ATV.Navigation.showError({
        data: {
          title: 'Přidáno do fronty',
          message: episode.attributes.title
        },
        type: 'document'
      })
    }
    else {
      ATV.Navigation.showError({
        data: {
          title: 'Chyba',
          message: 'Nelze přidat do fronty. Epizoda již není dostupná.'
        },
        type: 'document'
      })
    }
  },
  init() {
    if (player.playlist == null) {
      player.playlist = playlist
    }
  }
})

export default NowPlayingPage
