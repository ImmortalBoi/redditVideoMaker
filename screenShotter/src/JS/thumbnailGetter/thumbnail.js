const nodeFetch = require('node-fetch');
const { readFileSync,writeFileSync } = require('fs');
const { join } = require('path');
require('unsplash-js')
const { createApi } = require('unsplash-js')
// import { stringify } from 'querystring';

class thumbnailURLS {
  constructor(){
    this.URLS = [];
  }
  addURL(url){
    this.URLS.push(url);
  }
}

async function getThumbnailLinks(element) {
  const unsplash = createApi({
    accessKey: 'OXJpc1gFgnvtX54pmsvRMLcWmUg4rvlRwGucu6Ymh6I',
    fetch: nodeFetch,
  });
  let url;
  await unsplash.search.getPhotos({
    query: element,
    page: 1,
    perPage: 10,
    orientation: 'portrait',}).then(result => {
      if (result.errors) {
        console.log('error occurred: ', result.errors[0]);
      } else {
        const photo = result.response;
        url = photo.results[0].urls.small;
      }
    });
    return url;
}

async function getLinkObject() {
  let thumbnailLinks = new thumbnailURLS();
  try {
    for (let i = 1; i < 8; i++) {
      await getThumbnailLinks(JSON.parse(readFileSync("redditVideoMaker/screenShotter/src/JS/redditScraper/Week_Posts_AskReddit"+"Q"+i+".json", "utf8")).question).then(url=>{
        thumbnailLinks.addURL(url);
      });
    }
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
  return thumbnailLinks;
}

const getThumbnailJSON = getLinkObject().then(thumbnailLinks=>{
  let data = JSON.stringify(thumbnailLinks,null,4);
  try {
    writeFileSync(join("redditVideoMaker/screenShotter/src/JS/thumbnailGetter/thumbnailURLs/urls.json"), data);
    console.log("Thumbnail URL JSON data is saved.");
  } catch (error) {
    console.log("Thumbnail URL JSON data isn't saved");
  }     
})

