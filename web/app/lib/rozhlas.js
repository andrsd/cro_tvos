import ATV from 'atvjs'

const _ = ATV._ // lodash

// Doco @ https://rapidoc.croapp.cz/
const BASE_API_URL = 'https://api.mujrozhlas.cz'

const url = {
  // URLS Generators
  get homepage () {
    return `${BASE_API_URL}/homepage`
  },
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
  topic (topic_id) {
    return `${BASE_API_URL}/topics/${topic_id}`
  },
  topicEpisodes (topic_id) {
    return `${BASE_API_URL}/topics/${topic_id}/episodes`
  },
  episode (episode_id) {
    return `${BASE_API_URL}/episodes/${episode_id}`
  },
  get shows () {
    return `${BASE_API_URL}/shows`
  },
  show (show_id) {
    return `${BASE_API_URL}/shows/${show_id}`
  },
  showEpisodes (show_id) {
    return `${BASE_API_URL}/shows/${show_id}/episodes`
  },
  showSerials (show_id) {
    return `${BASE_API_URL}/shows/${show_id}/serials`
  },
  showParticipants (show_id) {
    return `${BASE_API_URL}/shows/${show_id}/participants`
  },
  get serials () {
    return `${BASE_API_URL}/serials`
  },
  serial (serial_id) {
    return `${BASE_API_URL}/serials/${serial_id}`
  },
  serialEpisodes (serial_id) {
    return `${BASE_API_URL}/serials/${serial_id}/episodes`
  },
  entityUrl(e) {
    if (e.type == 'show')
      return `${BASE_API_URL}/shows/${e.id}`
    else if (e.type == 'episode')
      return `${BASE_API_URL}/episodes/${e.id}`
    else if (e.type == 'serial')
      return `${BASE_API_URL}/serials/${e.id}`
    else if (e.type == 'topic')
      return `${BASE_API_URL}/topics/${e.id}`
    else
      return null
  }
}

export default {
  url
}
