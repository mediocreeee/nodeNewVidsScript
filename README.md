# Node Vids

# Description

Script checks if any of yours favorite youtubers uploaded a new video, if yes opens it for you to watch.

# Stack

- Node.js
- Youtube API

# Installation

Clone the repo in your folder

```sh
cd *your-folder*
git clone https://github.com/mediocreeee/nodeVids.git
```

Install all required packages via npm

```javascript
npm install
```

Fill this field in _watchvids_ file with your Youtube API key. (which you can get [there](https://developers.google.com/youtube/v3/getting-started))

```javascript
const apiKey = "insert API key there";
```

Change this field in _watchvids_ file with your browser (_firefox by default_)

```javascript
const browser = "firefox";
```

Fill the channelIds structure with youtube channels you want to follow

```javascript
//'random name what you like': 'channel id' (in the end of url on the channel's main page)
// Example:
const channelIds = {
  extremecode: "UCBNlINWfd08qgDkUTaUY4_w",
};
```

Then put folder where you cloned the repo in your \$PATH

Run the script for the first time to let the script to remember the last videos on provided channels
