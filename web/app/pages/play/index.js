import ATV from 'atvjs'

// TODO: check if programme changed and if so, change MediaItem accordingly
// TODO: if day changed, reload the schedule for the new day

import API from 'lib/rozhlas.js'

const PlayPage = ATV.Page.create({
	name: 'play',
	ready (options, resolve, reject) {
		var schedule

		let getStationInfo = API.get(API.url.stationInfo(options.id))
		let getCurrentSchedule = API.get(API.url.scheduleCurrent)

		Promise
			.all([getStationInfo, getCurrentSchedule])
			.then((xhrs) => {
				// success
				schedule = xhrs[1].response

				var now = new Date()
				var current_entry = null
				for (var entry of schedule.data) {
					var since = Date.parse(entry.attributes.since)
					var till = Date.parse(entry.attributes.till)
					if (since <= now && now < till && entry.relationships.station.data.id == options.id)
						current_entry = entry
				}

				let live_station = xhrs[0].response
				var bitrate = 0
				let playlist
				for (var pl of live_station.data.attributes.audioLinks) {
					if (pl.variant == 'mp3' && pl.linkType == "directstream" && pl.bitrate > bitrate) {
						bitrate = pl.bitrate
						playlist = pl.url
					}
				}

				const player = new Player()
				const tvosPlaylist = new Playlist()
				const mediaItem = new MediaItem('audio', playlist)
				if (current_entry != null) {
					mediaItem.title = current_entry.attributes.mirroredShow.title
					mediaItem.artworkImageURL = current_entry.attributes.asset.url
				}
				else {
					mediaItem.title = live_station.data.attributes.title
					mediaItem.artworkImageURL = live_station.data.attributes.asset.url
				}
				tvosPlaylist.push(mediaItem)
				player.playlist = tvosPlaylist
				player.play()

				resolve(false)
			}, (xhr) => {
				// fail
				reject(xhr)
			})
	}
})

export default PlayPage
