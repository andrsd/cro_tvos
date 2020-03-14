import ATV from 'atvjs'

const PlayEpisodePage = ATV.Page.create({
  name: 'play-episode',
  ready (options, resolve, reject) {

    var bitrate = 0
    let url
    for (var al of options.attributes.audioLinks) {
      if (al.variant == 'mp3' && al.linkType == "download" && al.bitrate > bitrate) {
        bitrate = al.bitrate
        url = al.url
      }
    }

    const player = new Player()
    const tvosPlaylist = new Playlist()
    const mediaItem = new MediaItem('audio', url)
    mediaItem.title = options.attributes.title
    mediaItem.description = options.attributes.description
    mediaItem.artworkImageURL = options.attributes.asset.url
    tvosPlaylist.push(mediaItem)
    player.playlist = tvosPlaylist
    player.play()
  }
})

export default PlayEpisodePage
