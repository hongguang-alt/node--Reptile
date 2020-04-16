const request = require('request')
const cheerio = require('cheerio')
//转码
const iconv = require('iconv-lite');
const fs = require('fs')
const path = require('path')
//爬到小说的章节网址以及标题
request.get({
    url:'https://www.xyj22.com/files/article/html/1/1822/index.html',
    encoding:null
},(error,response,body)=>{
    if(error) return

    var buf =  iconv.decode(body , 'gb2312');
    const $ = cheerio.load(buf)
    let arr =  $('.zjlist4 ol li a')
    let brr = []
    $(arr).each((index,item)=>{
       brr.push({
           "title":item.children[0].data.split(':').join(' ').replace('?',''),
           "href":'https://www.xyj22.com/files/article/html/1/1822/'+item.attribs.href
       })
    })
    // console.log(brr)
    $(brr).each((index,item)=>{
        getArticle(item)
    })
})
//获得具体章节的内容
function getArticle(object){
    request.get({url:object.href,encoding:null},(error,response,body)=>{
        var buf =  iconv.decode(body , 'gbk');
        const $ = cheerio.load(buf)
        let chapter = $('.contentbox').text()
        if(chapter){
            fs.writeFile(path.join(__dirname,'/article',object.title +'.txt'),chapter,function(err){
                if(err) return console.log(err)
            })
        }else{
            console.log(object.title)
        }
    })
}


// getArticle({title:'第74章去卓美工作',href:'https://www.xyj22.com/files/article/html/1/1822/666656.html'})