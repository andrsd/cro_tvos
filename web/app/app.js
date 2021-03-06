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
import HomePage from 'pages/home'
import SearchPage from 'pages/search'
import FavoritesPage from 'pages/favorites'
import NowPlayingPage from 'pages/now-playing'
/* eslint-disable no-unused-vars */
// These pages are not used here, but importing them has a side effect
// that the rest of the application relies on
import PlayPage from 'pages/play'
import SerialPage from 'pages/serial'
import TopicsPage from 'pages/topics'
import TopicPage from 'pages/topic'
import ShowPage from 'pages/show'
import EpisodePage from 'pages/episode'
/* eslint-enable no-unused-vars */

ATV.start({
	style: css,
	menu: {
		items: [
			{
				id: 'live',
				name: 'Živě',
				page: LivePage,
				attributes: { reloadOnSelect: true }
			},{
				id: 'home',
				name: 'Domů',
				page: HomePage,
				attributes: { autoHighlight: true, reloadOnSelect: true }
			},{
				id: 'favorites',
				name: 'Oblíbené',
				page: FavoritesPage,
				attributes: { reloadOnSelect: true }
			},{
				id: 'search',
				name: 'Hledat',
				page: SearchPage,
				attributes: { reloadOnSelect: true }
			},{
				id: 'now-playing',
				name: 'Nyní hrajeme',
				page: NowPlayingPage,
				attributes: { reloadOnSelect: false }
			}
		]
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
	onLaunch () {
		ATV.Menu.setOptions({
			loadingMessage: 'Nahráváme...'
		})
		ATV.Navigation.navigateToMenuPage()
	},
	onResume () {
	}
})
