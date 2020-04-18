// TODO: refactor functions
// TODO: refactor ids array into list
// TODO: add json file existance check
// TODO: maybe rewrite it not using youtube api

(async() => {
  const request = require('request')
  const fetch = require('node-fetch')
  const fs = require('fs')
  const opn = require('opn')

  // const apiKey = 'AIzaSyAW22VU0aa0ls8X7SeueLbLK8l5L7wyQb0'
  const apiKey = 'AIzaSyAvVAggkmaHOMAuij6Lqq4pU7A-xjqfp0E'
  const channelIds = ['UC2eYFnH61tmytImy1mTYvhA', 'UCVls1GmFKf6WlTraIb_IaJg']
  // const channelIds = []

  const baseVideoUrl = 'https://www.youtube.com/watch?v='
  const baseSearchUrl = 'https://www.googleapis.com/youtube/v3/search?'
  const youtubers = {
  }

  for (let i = 0; i < channelIds.length; i++){

	const url = `${baseSearchUrl}key=${apiKey}&channelId=${channelIds[i]}&part=snippet,id&order=date&maxResults=1`

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

	const youtuber = {
	  channelName: {
		lastVidId: videoId
	  }
	}
	youtubers[channelName] = videoId
	// console.log(JSON.stringify(youtubers, null ,2))

	fs.readFile('youtube.json', (err, data) => {
	  if(err) throw err
	  let youtubersJSON = JSON.parse(data)
	  let lastVideoId = youtubersJSON[channelName]
	  if(lastVideoId != videoId){
		opn(`${baseVideoUrl}${videoId}`, {app: 'opera'})
		let data = JSON.stringify(youtubers, null, 2)
		fs.writeFile('youtube.json', data, (err) => {
		  if (err) throw err
		  console.log('Found new video! Openning...')
		})
	  }else{
		console.log('No new vids')
	  }
	})
  }

})()

