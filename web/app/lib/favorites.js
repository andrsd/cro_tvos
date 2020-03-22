import ATV from 'atvjs'

const favInit = () => {
  let favorites = ATV.Settings.get('favorites')
  if (favorites === undefined) {
    favorites = []
    ATV.Settings.set('favorites', favorites)
  }
}

const change = (title, type, id) => {
  favInit()
  if (isFavorite(id)) {
    remove(id)
    return false
  }
  else {
    add(title, type, id)
    return true
  }
}

const getRatedButton = (fav) => {
  if (fav)
    return '<badge src="resource://button-rated" /><title>Nelíbit</title>'
  else
    return '<badge src="resource://button-rate" /><title>Oblíbit</title>'
}

const add = (title, type, id) => {
  let favorites = ATV.Settings.get('favorites')
  favorites.push({
    title: title,
    type: type,
    id: id
  })
  favorites.sort((a, b) => a['title'].localeCompare(b['title']))
  ATV.Settings.set('favorites', favorites)
}

const remove = (id) => {
  let favorites = ATV.Settings.get('favorites')
  favorites = favorites.filter(object => object.id !== id)
  ATV.Settings.set('favorites', favorites)
}

const isFavorite = (id) => {
  favInit()

  let favorites = ATV.Settings.get('favorites')
  if (favorites === undefined) {
    favorites = []
    ATV.Settings.set('favorites', favorites)
  }

  let show = favorites.find(object => object.id === id)
  if (show === undefined)
    return false
  else
    return true
}

export default {
  change,
  isFavorite,
  getRatedButton
}
