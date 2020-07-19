import API from '../web/app/lib/rozhlas.js'

import chai from 'chai'
const expect = chai.expect


describe('API', function () {
	var base_api = `https://api.mujrozhlas.cz`
	it('homepage', function(done) {
		expect(API.url.homepage).to.equal(`${base_api}/homepage`)
		done()
	})

	it('stations', function(done) {
		expect(API.url.stations).to.equal(`${base_api}/stations`)
		done()
	})
	it('stationInfo', function(done) {
		expect(API.url.stationInfo('1234')).to.equal(`${base_api}/stations/1234`)
		done()
	})

	it('scheduleCurrent', function(done) {
		expect(API.url.scheduleCurrent).to.equal(`${base_api}/schedule-current`)
		done()
	})
	it('stationSchedule', function(done) {
		expect(API.url.stationSchedule("radio", "2020", "06", "15")).to.equal(`https://api.rozhlas.cz/data/v2/schedule/day/2020/06/15/radio/brief.json`)
		done()
	})

	it('search', function(done) {
		expect(API.url.search).to.equal(`${base_api}/search`)
		done()
	})

	it('topics', function(done) {
		expect(API.url.topics).to.equal(`${base_api}/topics`)
		done()
	})
	it('topic', function(done) {
		expect(API.url.topic('1234')).to.equal(`${base_api}/topics/1234`)
		done()
	})
	it('topicEpisodes', function(done) {
		expect(API.url.topicEpisodes('1234')).to.equal(`${base_api}/topics/1234/episodes`)
		done()
	})

	it('episode', function(done) {
		expect(API.url.episode(1234)).to.equal(`${base_api}/episodes/1234`)
		done()
	})

	it('shows', function(done) {
		expect(API.url.shows).to.equal(`${base_api}/shows`)
		done()
	})
	it('show', function(done) {
		expect(API.url.show('1234')).to.equal(`${base_api}/shows/1234`)
		done()
	})
	it('showEpisodes', function(done) {
		expect(API.url.showEpisodes('1234')).to.equal(`${base_api}/shows/1234/episodes`)
		done()
	})
	it('showSerials', function(done) {
		expect(API.url.showSerials('1234')).to.equal(`${base_api}/shows/1234/serials`)
		done()
	})
	it('showParticipants', function(done) {
		expect(API.url.showParticipants('1234')).to.equal(`${base_api}/shows/1234/participants`)
		done()
	})

	it('serials', function(done) {
		expect(API.url.serials).to.equal(`${base_api}/serials`)
		done()
	})
	it('serial', function(done) {
		expect(API.url.serial('1234')).to.equal(`${base_api}/serials/1234`)
		done()
	})
	it('serialEpisodes', function(done) {
		expect(API.url.serialEpisodes('1234')).to.equal(`${base_api}/serials/1234/episodes`)
		done()
	})

	it('entityUrl-show', function(done) {
		expect(API.url.entityUrl({id: 1234, type:'show'})).to.equal(`${base_api}/shows/1234`)
		done()
	})
	it('entityUrl-episode', function(done) {
		expect(API.url.entityUrl({id: 1234, type:'episode'})).to.equal(`${base_api}/episodes/1234`)
		done()
	})
	it('entityUrl-serial', function(done) {
		expect(API.url.entityUrl({id: 1234, type:'serial'})).to.equal(`${base_api}/serials/1234`)
		done()
	})
	it('entityUrl-topic', function(done) {
		expect(API.url.entityUrl({id: 1234, type:'topic'})).to.equal(`${base_api}/topics/1234`)
		done()
	})
	it('entityUrl-null', function(done) {
		expect(API.url.entityUrl({})).to.be.null
		done()
	})
});
