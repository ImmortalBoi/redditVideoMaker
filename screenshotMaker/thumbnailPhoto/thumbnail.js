import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { stringify } from 'querystring';

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
      await getThumbnailLinks(JSON.parse(fs.readFileSync("redditVideoMaker/screenshotMaker/thumbnailPhoto/redditScraper/Week_Posts_AskReddit/"+"Q"+i+".json", "utf8")).question).then(url=>{
        thumbnailLinks.addURL(url);
      });
    }
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
  return thumbnailLinks;
}

getLinkObject().then(thumbnailLinks=>{
  let data = JSON.stringify(thumbnailLinks,null,4);
  try {
    fs.writeFileSync(path.join("redditVideoMaker/screenshotMaker/thumbnailPhoto/thumbnailURLs/urls.json"), data);
    console.log("JSON data is saved.");
  } catch (error) {
    console.log("JSON data isn't saved");
  }     
})

// import { createApi } from 'unsplash-js';
// import nodeFetch from 'node-fetch';
// import * as fs from 'fs';
// import * as path from 'path';
// import { stringify } from 'querystring';

// class thumbnailURLS {
//   constructor(){
//     this.URLS = [];
//   }

//   addURL(url){
//     this.URLS[this.URLS.length]=url;
//   }
  
//   async getThumbnailLinks(element) {
//     const unsplash = createApi({
//       accessKey: 'OXJpc1gFgnvtX54pmsvRMLcWmUg4rvlRwGucu6Ymh6I',
//       fetch: nodeFetch,
//     });
//     let url;
//     await unsplash.search.getPhotos({
//       query: element,
//       page: 1,
//       perPage: 10,
//       orientation: 'portrait',}).then(result => {
//         if (result.errors) {
//           console.log('error occurred: ', result.errors[0]);
//         } else {
//           const photo = result.response;
//           url = photo.results[0].urls.small;
//         }
//       });
//       return url;
//   }

//   async getQuestion(index){

//     let url = fs.readFile("redditVideoMaker/screenshotMaker/thumbnailPhoto/redditScraper/Week_Posts_AskReddit/"+"Q"+index+".json", "utf8", (err, jsonString) => {
//       try {
//         JSON.parse(jsonString).question;
//       } catch (err) {
//         console.log("Error parsing JSON string:", err);
//       }
//     });
//   }
// }



// async function getLinkObject() {
//   let thumbnailLinks = new thumbnailURLS();

//   Promise.all(()=>{

//   })

//   for (let index = 1; index < 8; index++) {
    
//   }
//   console.log(thumbnailLinks);
//   return thumbnailLinks;
// }

// getLinkObject().then(thumbnailLinks=>{
//   let data = stringify(thumbnailLinks,null,4)
//   try {
//     fs.writeFileSync(path.join("redditVideoMaker/screenshotMaker/thumbnailPhoto/thumbnailURLs/urls.json"), data);
//     console.log("JSON data is saved.");
//   } catch (error) {
//     console.log("JSON data isn't saved");
//   }     
// })
