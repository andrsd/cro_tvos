// ruby -run -ehttpd . -p9009
// npm start

import ATV from 'atvjs'

// template helpers
import 'lib/template-helpers'
// raw css string
import css from 'assets/css/app.css'
// shared templates
import loaderTpl from 'shared/templates/loader.hbs'
import errorTpl from 'shared/templates/error.hbs'

// pages
import LivePage from 'pages/live'
import PlayPage from 'pages/play'
import TopicsPage from 'pages/topics'
import ShowPage from 'pages/show'
import EpisodePage from 'pages/episode'
import PlayEpisodePage from 'pages/play-episode'
import SearchPage from 'pages/search'

ATV.start({
  style: css,
  menu: {
    items: [{
      id: 'live',
      name: 'Živě',
      page: LivePage,
      attributes: { autoHighlight: true, reloadOnSelect: true }
    },{
      id: 'topics',
      name: 'Témata',
      page: TopicsPage,
      attributes: { reloadOnSelect: true }
    },{
      id: 'search',
      name: 'Hledat',
      page: SearchPage,
      attributes: { reloadOnSelect: true }
    }]
  },
  templates: {
    loader: loaderTpl,
    error: errorTpl,
    // status level error handlers
    status: {
      '404': () => errorTpl({
        title: '404',
        message: 'Stránka nebyla nalezena!'
      }),
      '500': () => errorTpl({
        title: '500',
        message: 'V aplikaci nastala neznámá chyba. Prosím, zkuste to později znovu.'
      }),
      '503': () => errorTpl({
        title: '503',
        message: 'V aplikaci nastala neznámá chyba. Prosím, zkuste to později znovu.'
      })
    }
  },
  onLaunch (options) {
    ATV.Menu.setOptions({
      loadingMessage: 'Loading'
    })
    ATV.Navigation.navigateToMenuPage()
  },
  onResume (options) {
    // ATV.Navigation.clear()
    // ATV.Navigation.navigateToMenuPage()
  }
})
