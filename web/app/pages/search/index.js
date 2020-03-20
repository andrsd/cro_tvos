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

    let getSearch = ATV.Ajax.get(API.url.search + '?filter[fulltext]=' + encodeURIComponent(searchText) + '&onlyPlayable=true')

    // Then resolve them at once
    Promise
      .all([getSearch])
      .then((xhrs) => {
        let results = xhrs[0].response

        for (var r of results.data) {
          if (r.type == 'show') {
            shows.push(r)
          }
          else if (r.type == 'episode') {
            episodes.push(r)
          }
        }

        //overwrite stringData for new input element if search results exist by dynamically constructing shelf template fragment
        lsInput.stringData = searchTpl({
          shows: shows,
          episodes: episodes
        });

        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
      }, (xhr) => {
        // error
        reject()
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
