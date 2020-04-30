#!/usr/bin/env node

// TODO: refactor in functions
// TODO: maybe rewrite it not using youtube api
// TODO: error handling
// TODO: folder navigation

(async () => {
  const fetch = require("node-fetch");
  const fs = require("fs");
  const os = require("os");
  const opn = require("opn");
  const util = require("util")

  const readFile = util.promisify(fs.readFile)
  const writeFile = util.promisify(fs.writeFile)

  // User settings
  const user = ""; // Your system user nickname
  const browser = ""; // Browser in which you want to open videos
  const channelIds = {
	// Your channels list to follow
	extremecode: "UCBNlINWfd08qgDkUTaUY4_w",
  };

  // Script setup
  const homedir = os.homedir();
  const apiKey = '' // Your YoutubeDataAPI key
  const baseVideoUrl = "https://www.youtube.com/watch?v=";
  const baseSearchUrl = "https://www.googleapis.com/youtube/v3/search?";
  const youtubers = {};

  // Check if the file with channels and videos already exists
  if (!fs.existsSync(`${homedir}/scripts/watchvids/youtube.json`)) {
	fs.writeFile(`${homedir}/scripts/watchvids/youtube.json`, "", (err) => {
	  if (err) throw err;
	});
  }

  // Iteration on users channels list and openning new videos in browser
  for (const id in channelIds) {
	// Video url
	const url = `${baseSearchUrl}key=${apiKey}&channelId=${channelIds[id]}&part=snippet,id&order=date&maxResults=1`;

	// Getting data from YoutubeDataAPI
	const getYoutubeJSON = async (url) => {
	  try {
		const res = await fetch(url);
		const json = await res.json();
		return json;
	  } catch (err) {
		console.log(err);
	  }
	};
	const youtubeJSON = await getYoutubeJSON(url);
	const videoId = youtubeJSON["items"][0]["id"]["videoId"];
	const channelName = youtubeJSON["items"][0]["snippet"]["channelTitle"];

	// File write schema
	youtubers[channelName] = videoId;

	// Reading youtubers.json
	const previousVideoData = await readFile(`${homedir}/scripts/watchvids/youtube.json`, "utf-8")
	  .catch(err => console.log(err))

	// Check if file is empty
	if (previousVideoData == ""){
	  await opn(`${baseVideoUrl}${videoId}`, { app: browser });
	  let newVideoData = await JSON.stringify(youtubers, null, 2)
	  await writeFile(`${homedir}/scripts/watchvids/youtube.json`, newVideoData)
		.then( () => {
		  console.log(
			`Found new video on channel ${channelName}! Openning...`
		  )
		})
		.catch(err => console.log(err))
	} else {
	  // If not read previous data and match with new
	  let youtubersJSON = await JSON.parse(previousVideoData);
	  let lastVideoId = youtubersJSON[channelName];
	  if (lastVideoId != videoId) {
		console.log(`Found new video on channel ${channelName}! Openning...`)
		await opn(`${baseVideoUrl}${videoId}`, { app: browser });
	  } else {
		console.log(`No new vids on channel ${channelName}`);
	  }
	}
  }

  // Write newly generated data into file
  let newVideoData = await JSON.stringify(youtubers, null, 2);
  await writeFile(`${homedir}/scripts/watchvids/youtube.json`, newVideoData).catch( err => console.log(err))
})();
