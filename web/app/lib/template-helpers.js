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
  }
}

// register all helpers
_.each(helpers, (fn, name) => Handlebars.registerHelper(name, fn))

export default helpers
