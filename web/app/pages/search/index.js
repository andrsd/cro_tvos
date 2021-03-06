import ATV from 'atvjs'

import template from './template.hbs'
import searchTpl from './search.hbs'
import noResultsTpl from './noresults.hbs'

import API from 'lib/rozhlas.js'

function buildResults(doc, searchText) {
	// Create parser and new input element
	var domImplementation = doc.implementation;
	var lsParser = domImplementation.createLSParser(1, null);
	var lsInput = domImplementation.createLSInput();

	// set default template fragment to display no results
	lsInput.stringData = ``;

	if (searchText) {
		var shows = []
		var episodes = []
		var serials = []

		// Then resolve them at once
		API
			.get(API.url.search + '?filter[fulltext]=' + encodeURIComponent(searchText) + '&onlyPlayable=true')
			.then((xhrs) => {
				let results = xhrs.response
				var serial_ids = {}

				for (var r of results.data) {
					if (r.type == 'show') {
						shows.push(r)
					}
					else if (r.type == 'episode') {
						episodes.push(r)
						if (r.relationships && 'serial' in r.relationships && 'data' in r.relationships.serial) {
							serial_ids[r.relationships.serial.data.id] = true
						}
					}
				}

				var promises = []

				for (var id in serial_ids) {
					promises.push(
						API.get(API.url.serial(id))
							.then((xhr) => {
								serials.push(xhr.response.data)
							})
					)
				}

				Promise
					.all(promises)
					.then(() => {

						//overwrite stringData for new input element if search results exist by dynamically constructing shelf template fragment
						lsInput.stringData = searchTpl({
							shows: shows,
							episodes: episodes,
							serials: serials
						});

						//add the new input element to the document by providing the newly created input, the context,
						//and the operator integer flag (1 to append as child, 2 to overwrite existing children)
						lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
					}, () => {
						// error
					})
			}, () => {
				// error
			})
	}
	else {
		lsInput.stringData = noResultsTpl();
		lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
	}
}

const SearchPage = ATV.Page.create({
	name: 'search',
	template: template,
	afterReady(doc) {
		let searchField = doc.getElementsByTagName('searchField').item(0);
		let keyboard = searchField && searchField.getFeature('Keyboard');

		if (keyboard) {
			keyboard.onTextChange = function() {
				let searchText = keyboard.text;
				console.log(`search text changed: ${searchText}`);
				buildResults(doc, searchText);
			};
		}
	}
})

export default SearchPage
