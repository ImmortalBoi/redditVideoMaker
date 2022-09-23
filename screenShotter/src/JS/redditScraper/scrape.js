const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class qandA {
    constructor(question,questionAuthor,ThumbnailQuery,arrayAnswer){
        this.question = question;
        this.questionAuthor = questionAuthor;
        this.arrayAnswer = [];
    }
    addAnswer(text){
        this.arrayAnswer[this.arrayAnswer.length] = text;
    }
}

class comment{
    constructor(commentText,commentAuthor,commentReplies,thumbnailLink){
        this.commentText = commentText;
        this.commentAuthor = commentAuthor;
        this.commentReplies = [];
        this.thumbnailLink = thumbnailLink;
    }
    addComment(text){
        this.commentReplies[this.commentReplies.length] = text;
    }
}

class aitaPost{
    constructor(postText,postAuthor,postTitle){
        this.postText = postText;
        this.postAuthor = postAuthor;
        this.postTitle = postTitle;
    }
}

const scrapeAskReddit = request('https://old.reddit.com/r/AskReddit/top/?sort=top&t=week', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let urls = [];
        const $ = cheerio.load(html);
        const content = $('[data-url]').each((i, el) => {
            let item = $(el).data('url');
            String(item);
            item = 'https://old.reddit.com'+item+'?sort=top';
            urls.push(item);
        });

        for (let i = 0; i < 7; i++) {
            request(urls[i], (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
            
                    //finding original question
                    let questionSource = $('div.sitetable.linklisting');
                    let questionTitle = questionSource.find('a.title').text();
                    let questionAuthor = 'u/'+questionSource.find('a.author').text();
                    
                    const question = new qandA(questionTitle,questionAuthor);
            
                    //finding comments
                    const test = $('div.sitetable.nestedlisting').children('div.thing').each((i,el)=>{
                    	//finding root comment
	                    let rootComment = $(el).children("div.entry.unvoted")
	                    let rootCommentText = rootComment.find('div.md').text();
	                    let rootCommentAuthor = 'u/' + rootComment.find('a.author').text()
	                    const newComment = new comment(rootCommentText,rootCommentAuthor);
	            
	             
	                    let subComment = $(el).children("div.child:first").find('div.entry.unvoted').slice(0,3).each((i,el)=>{
	                        let subCommentText = $(el).find('div.md').children('p').text();
	                        let subCommentAuthor = 'u/'+$(el).find('a.author').text();
	                        const newSubComment = new comment(subCommentText,subCommentAuthor);
	                        newComment.addComment(newSubComment);
                    });
                    question.addAnswer(newComment);
                    if(i==25){
                        return false
                    }
                    });

                    let filename = 'Q'+(i+1);
                    let data = JSON.stringify(question,null,4);
                    try {
                        fs.writeFileSync(path.join(__dirname,"Week_Posts_AskReddit",filename+".json"), data);
                        console.log("Askreddit JSON data is saved.");
                    } catch (error) {
                        console.log("Askreddit JSON data isn't saved");
                    }                    

                }
            })
        }

    }
})

const scrapeAITA = request('https://old.reddit.com/r/AmItheAsshole/top/?sort=top&t=week', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let urls = [];
        const $ = cheerio.load(html);
        const content = $('[data-url]').each((i, el) => {
            let item = $(el).data('url');
            String(item);
            item = 'https://old.reddit.com'+item+'?sort=top';
            urls.push(item);
        });

        for (let i = 0; i < 7; i++) {
            request(urls[i], (error, response, html) =>{
                const $ = cheerio.load(html);
                const postDiv = $('div.content').children('div.sitetable.linklisting').find('div.entry.unvoted')
                const postAuthor = postDiv.find('a.author').text();
                const postText = postDiv.find('div.md').text();
                const postTitle = postDiv.find('a.title').text();
                const post = new aitaPost(postText,postAuthor,postTitle);

                let filename = 'P'+(i+1);
                let data = JSON.stringify(post,null,4);
                try {
                    fs.writeFileSync(path.join(__dirname,"Week_Posts_AITA",filename+".json"), data);
                    console.log("AITA JSON data is saved.");
                } catch (error) {
                    console.log("AITA JSON data isn't saved");
                }                    

            })
        }
    }
})

