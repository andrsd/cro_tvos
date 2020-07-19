import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const HomePage = ATV.Page.create({
	name: 'home',
	template: template,
	ready (options, resolve, reject) {
		var carousel
		var dashboard = []
		var sections = []

		API
			.get(API.url.homepage)
			.then((xhr) => {
				var promises = []

				for (let it of xhr.response.data) {
					if (it.id == 0) {
						var rec_items = []
						for (let jtem of it.attributes.items)
							if (jtem.itemType == "audio")
								rec_items.push(jtem)

						carousel = {
							items: rec_items,
							title: it.attributes.title
						}
					}
					else if (it.id == 9) {
						let items = it.attributes.items.slice(0, 5)
						for (let jtem of items)
						{
							if (jtem.dashboardType == 'dashboard_topic') {
								let url = API.url.entityUrl(jtem.attributes.entity)
								promises.push(
									API
										.get(url)
										.then((xhr) => {
											dashboard.push(xhr.response.data)
											return true
										}, () => {
											return true
										})
								)
							}
						}
					}
					else if (it.type == "content_section" || it.type == "section_category") {
						let sec = {
							title: it.attributes.title,
							items: []
						}
						sections.push(sec)

						let entities
						if (it.id == 140 || it.id == 83)
							entities = it.attributes.entities.slice(0, 8)
						else if (it.id == 3)
							entities = it.attributes.entities.slice(0, 10)
						else
							entities = it.attributes.entities

						for (let entity of entities) {
							let url = API.url.entityUrl(entity)

							if (url != null) {
								promises.push(
									API
										.get(url)
										.then((xhr) => {
											sec.items.push(xhr.response.data)
											return true
										}, () => {
											return true
										})
								)
							}
						}
					}
					else if (it.type == "junior") {
						let sec = {
							id: it.id,
							title: it.attributes.title,
							items: []
						}
						sections.push(sec)

						for (let entity of it.attributes.items) {
							let url = API.url.entityUrl(entity)

							if (url != null) {
								promises.push(
									API
										.get(url)
										.then((xhr) => {
											sec.items.push(xhr.response.data)
											return true
										}, () => {
											return true
										})
								)
							}
						}
					}
				}

				return Promise.all(promises)
			}, () => {
				reject()
			})
			.then(() => {
				resolve({
					carousel: carousel,
					dashboard: dashboard,
					sections: sections
				})
			}, () => {
				ATV.Navigation.showError({
					data: {
						title: 'Hovno',
						message: 'Nic nebude'
					},
					type: 'document'
				})
			})
	},
	afterReady(doc) {
		doc
			.getElementById('read-btn')
			.addEventListener('select', () => {
				ATV.Navigation.navigate('topic', { id: API.ids.read })
			})
		doc
			.getElementById('docs-btn')
			.addEventListener('select', () => {
				ATV.Navigation.navigate('topic', { id: API.ids.docs })
			})
		doc
			.getElementById('kids-btn')
			.addEventListener('select', () => {
				ATV.Navigation.navigate('topic', { id: API.ids.kids })
			})
	}
})

export default HomePage
