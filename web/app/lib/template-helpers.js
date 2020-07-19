import ATV from 'atvjs'
import Handlebars from 'handlebars'
import stripHtml from 'string-strip-html'

const _ = ATV._

function assetUrl (name) {
	return `${ATV.launchOptions.BASEURL}assets/${name}`
}

const helpers = {
	toJSON (obj = {}) {
		let str
		try {
			str = JSON.stringify(obj)
		} catch (ex) {
			str = '{}'
		}
		return str
	},
	asset_url (asset) {
		return new Handlebars.SafeString(assetUrl(asset))
	},
	fullImageURL (imageURL) {
		return new Handlebars.SafeString(imageURL)
	},
	removeHTML (str) {
		return stripHtml(str)
	},
	longDate (date) {
		var d = new Date(date)
		return d.toLocaleDateString()
	},
	timeLength (since, till) {
		var start = new Date(since)
		var end = new Date(till)
		var len = end - start
		var minutes = Math.floor((len / (1000 * 60)) % 60)
		var hours = Math.floor((len / (1000 * 60 * 60)) % 24)

		if (hours == 0)
			return minutes + " min"
		else {
			if (minutes > 0)
				return hours + " h " + minutes  + " min"
			else
				return hours + " h"
		}
	},
	watchedState (state) {
		if (state == 0)
			return "&#9673;"
		else if (state < 1)
			return "&#9686;"
		else
			return "&#8194;"
	},
	numParts (parts) {
		if (parts == 1)
			return `${parts} díl`
		else if (parts <= 4)
			return `${parts} díly`
		else
			return `${parts} dílů`
	}
}

// register all helpers
_.each(helpers, (fn, name) => Handlebars.registerHelper(name, fn))

export default {
	helpers
}
