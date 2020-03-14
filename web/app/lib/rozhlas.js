import ATV from 'atvjs'

const _ = ATV._ // lodash

// Doco @ https://rapidoc.croapp.cz/
const BASE_API_URL = 'https://api.mujrozhlas.cz'

const url = {
  // URLS Generators
  get stations () {
    return `${BASE_API_URL}/stations`
  },
  stationInfo (id) {
    return `${BASE_API_URL}/stations/${id}`
  },
  get scheduleCurrent () {
    return `${BASE_API_URL}/schedule-current`
  },
  stationSchedule(name, year, month, day) {
    return `https://api.rozhlas.cz/data/v2/schedule/day/${year}/${month}/${day}/${name}/brief.json`
  },
  get search () {
    return `${BASE_API_URL}/search`
  },
  get topics () {
    return `${BASE_API_URL}/topics`
  },
  topicEpisodes (topic_id) {
    return `${BASE_API_URL}/topics/${topic_id}/episodes`
  },
  episode (episode_id) {
    return `${BASE_API_URL}/episodes/${episode_id}`
  },
  showEpisodes (show_id) {
    return `${BASE_API_URL}/shows/${show_id}/episodes`
  }
}

export default {
  url
}
