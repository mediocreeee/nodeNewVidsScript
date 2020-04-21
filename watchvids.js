#!/usr/bin/env node

// TODO: refactor functions
// TODO: maybe rewrite it not using youtube api

(async() => {
  const fetch = require('node-fetch')
  const fs = require('fs')
  const os = require('os')
  const opn = require('opn')

  // User settings
  const user = '' // Your system user nickname
  const browser = '' // Browser in which you want to open videos
  const channelIds = { // Your channels list to follow
	'lukesmith': 'UC2eYFnH61tmytImy1mTYvhA', // ex: 'random name what u like': 'channel id (in the end of url on the channel's main page)'
	'dt': 'UCVls1GmFKf6WlTraIb_IaJg',
	'extremecode': 'UCBNlINWfd08qgDkUTaUY4_w',
	'kell': 'UCfn7uyPvr5IY5pux8oyIa4Q',
	'later': 'UCfdgIq01iG92AXBt-NxgPkg',
	'kultas': 'UCDM0Ng48_zAMTazoC_XAsaA',
	'slizen': 'UCr1Pf6rqk3h8b1APvAt42Bw',
  }

  // Script setup
  const homedir = os.homedir()
  const apiKey = '' // Your YoutubeDataAPI key
  const baseVideoUrl = 'https://www.youtube.com/watch?v='
  const baseSearchUrl = 'https://www.googleapis.com/youtube/v3/search?'
  const youtubers = {}

  // Check if the file with channels and videos already exists
  if(!fs.existsSync(`${homedir}/scripts/watchvids/youtube.json`)) {
	fs.writeFile(`${homedir}/scripts/watchvids/youtube.json`,'', (err) => {
	  if (err) throw err
	})
  }

  // Iteration on users channels list and openning new videos in browser
  for (const id in channelIds){

	// Video url
	const url = `${baseSearchUrl}key=${apiKey}&channelId=${channelIds[id]}&part=snippet,id&order=date&maxResults=1`

	// Getting data from YoutubeDataAPI
	const getYoutubeJSON = async url => {
	  try {
		const res = await fetch(url)
		const json = await res.json()
		return json
	  }catch(err) {
		console.log(err)
	  }
	}
	const youtubeJSON = await getYoutubeJSON(url)
	const videoId = youtubeJSON['items'][0]['id']['videoId']
	const channelName = youtubeJSON['items'][0]['snippet']['channelTitle']

	// File write schema
	const youtuber = {
	  channelName: {
		lastVidId: videoId
	  }
	}
	youtubers[channelName] = videoId

	fs.readFile(`${homedir}/scripts/watchvids/youtube.json`, 'utf-8', (err, previousVideoData) => {
	  if(err) throw err

	  // Check if file is empty
	  if(previousVideoData == ''){
		opn(`${baseVideoUrl}${videoId}`, {app: browser})
		let newVideoData = JSON.stringify(youtubers, null, 2)
		fs.writeFile(`${homedir}/scripts/watchvids/youtube.json`, newVideoData, (err) => {
		  if (err) throw err
		  console.log(`Found new video on channel ${channelName}! Openning...`)
		})
		return
	  }
	  // If the file exists read previous data and match with new
	  let youtubersJSON = JSON.parse(previousVideoData)
	  let lastVideoId = youtubersJSON[channelName]
	  if(lastVideoId != videoId){
		opn(`${baseVideoUrl}${videoId}`, {app: browser})
		let newVideoData = JSON.stringify(youtubers, null, 2)
		fs.writeFile(`${homedir}/scripts/watchvids/youtube.json`, newVideoData, (err) => {
		  if (err) throw err
		  console.log(`Found new video on channel ${channelName}! Openning...`)
		})
	  }else{
		console.log(`No new vids on channel ${channelName}`)
	  }
	})
  }

})()


