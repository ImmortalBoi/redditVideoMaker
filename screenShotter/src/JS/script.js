
const buttonTest = document.getElementById('testButton');
buttonTest.addEventListener("click", ()=>{
    html2canvas(document.getElementById("testButton")).then(canvas => {
    document.body.appendChild(canvas)})
});


//askReddit handling
// function askRedditScreenshots() {
    // for (let index = 0; index < 8; index++) {
        
    // }
    // fetch("./thumbnailPhoto/redditScraper/Week_Posts_AskReddit/Q1.JSON").then((response)=>{return response.json();}).then((askRedditPost)=>{

    //     //Setting up the question
    //     document.getElementById("questionAuthor").innerHTML = "Posted by "+askRedditPost.questionAuthor;
    //     document.getElementById("question").innerHTML = askRedditPost.question;

    //     html2canvas(document.querySelector("#questionCapture")).then(canvas => {
    //         var image = canvas.toDataURL("image/png").replace("image/png","image/octet-stream")
    //         document.write('<img src="'+image+'"/>');

    //     });


    //     //Setting up the Comments

    // })
// }

