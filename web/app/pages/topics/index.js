import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const TopicsPage = ATV.Page.create({
	name: 'topics',
	template: template,
	ready (options, resolve, reject) {
		let getTopics = API.get(API.url.topics)

		Promise
			.all([getTopics])
			.then((xhrs) => {
				resolve({
					topics: xhrs[0].response.data
				})
			}, () => {
				// error
				reject()
			})
	},
})

export default TopicsPage
