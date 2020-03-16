import ATV from 'atvjs'

const PlayEpisodePage = ATV.Page.create({
  name: 'play-episode',
  ready (options, resolve, reject) {
    if (options.attributes.audioLinks.length > 0) {
      var bitrate = 0
      let url = null
      for (var al of options.attributes.audioLinks) {
        if (al.variant == 'mp3' && al.linkType == "download" && al.bitrate > bitrate) {
          bitrate = al.bitrate
          url = al.url
        }
      }

      if (url) {
        const player = new Player()
        const tvosPlaylist = new Playlist()
        const mediaItem = new MediaItem('audio', url)
        mediaItem.title = options.attributes.title
        mediaItem.description = options.attributes.description
        if (typeof options.attributes.asset != 'undefined' &&
            typeof options.attributes.asset.url != 'undefined')
          mediaItem.artworkImageURL = options.attributes.asset.url
        tvosPlaylist.push(mediaItem)
        player.playlist = tvosPlaylist
        player.play()
      }
      else {
        ATV.Navigation.navigate('error', {
          title: 'Chyba',
          message: 'Nelze přehrát. Nepodařilo se najít URL audio souboru.'
        })
      }
    }
    else {
      ATV.Navigation.navigate('error', {
        title: 'Chyba',
        message: 'Nelze přehrát. Epizoda již není dostupná.'
      })
    }

    resolve(false)
  }
})

export default PlayEpisodePage
