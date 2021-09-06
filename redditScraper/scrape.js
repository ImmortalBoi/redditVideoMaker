const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class qandA {
    constructor(question,questionAuthor,arrayAnswer){
        this.question = question;
        this.questionAuthor = questionAuthor;
        this.arrayAnswer = [];
    }
    addAnswer(text){
        this.arrayAnswer[this.arrayAnswer.length] = text;
    }
}

class comment{
    constructor(commentText,commentAuthor,commentReplies){
        this.commentText = commentText;
        this.commentAuthor = commentAuthor;
        this.commentReplies = [];
    }
    addComment(text){
        this.commentReplies[this.commentReplies.length] = text;
    }
}


request('https://old.reddit.com/r/AskReddit/top/?sort=top&t=week', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let urls = [];
        const $ = cheerio.load(html);
        const content = $('[data-url]').each((i, el) => {
            let item = $(el).data('url');
            String(item);
            item = 'https://old.reddit.com'+item+'?sort=top';
            urls.push(item);
        });

        for (let i = 0; i < 10; i++) {
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
                        subCommentText = $(el).find('div.md').children('p').text();
                        subCommentAuthor = 'u/'+$(el).find('a.author').text();
                        const newSubComment = new comment(subCommentText,subCommentAuthor);
                        newComment.addComment(newSubComment);
                    });
                    question.addAnswer(newComment);
                    if(i==25){
                        return false
                    }
                    });
                    //TODO insert a write to JSON file code here
                    let filename = 'Q'+i+'. '+ question.question.slice(0,20).replace('/', '');
                    let data = JSON.stringify(question,null,4);
                    try {
                        fs.writeFileSync(path.join(__dirname,"Week_Posts",filename+".json"), data);
                        console.log("JSON data is saved.");
                    } catch (error) {
                        console.log("JSON data isn't saved");
                    }                    

                }
            })
        }

    }
})

