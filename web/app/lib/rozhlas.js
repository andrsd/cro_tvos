// Doco @ https://rapidoc.croapp.cz/
const BASE_API_URL = 'https://api.mujrozhlas.cz'

function request(url, method) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		xhr.responseType = 'json'
		xhr.open(method, url)
		xhr.setRequestHeader('Accept', 'application/json')
		xhr.setRequestHeader('Content-Type', 'application/json')
		// listen to the state change
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) {
				return
			}

			if (xhr.status >= 200 && xhr.status <= 300) {
				resolve(xhr)
			} else {
				reject(xhr)
			}
		}
		// error handling
		xhr.addEventListener('error', () => reject(xhr))
		xhr.addEventListener('abort', () => reject(xhr))
		// send request
		xhr.send()
	})
}

function get(url) {
	return request(url, 'GET')
}

function put(url) {
	return request(url, 'PUT')
}

function post(url) {
	return request(url, 'POST')
}

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

const ids = {
	// hry, cetby a povidky
	'read': '671d0806-2afe-4282-ae90-319b6ef369a2',
	// pro deti
	'kids': '8ed08518-9d92-437c-a96f-e5df046aff4e',
	// dokumenty
	'docs': '05bc9bd7-7a9d-49a6-b1aa-12a7bfb558f7'
}

export default {
	url,
	get,
	put,
	post,
	ids
}
