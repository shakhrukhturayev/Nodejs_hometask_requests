const http = require('http')
const fs = require('fs')
const path = require('path')
const { title } = require('process')
let arr = []
let book_id = 0
let ans = ''
let last_id=1
let edit_id=0

function deco(text){ //url kodlarini text ga almashtiradi
    return decodeURIComponent(text)
}

function deco_rep(text){// + larni porbel ga almashtiradi
    text = deco(text)
    return text.replace(/\u002b/g, " ")
}

function yozish(text){
    fs.writeFile(path.join(__dirname,'books2.json'),text,(err)=>{
               
    })
}

/*
* books.jsonni o'qib arrayga aylantirib beradi
* @return books.json array holatida
*/
fs.readFile(path.join(__dirname, 'books2.json'), 'utf-8', (err, data) => {
    if (err) throw err
    arr = JSON.parse(data)
})



const server = http.createServer((req, res) => {
    let url = req.url
   
    if(url=='/'){
        res.end('Node js repetetation')
    }

    let metod = req.method;

    if (metod == "GET"){
        if (url === '/books'){ //1 
            res.end(JSON.stringify(arr))        
        } else if (url.substring(0, 6) == '/books'){ // 2
            ans = ''
            url = url.substring(7)
            book_id = parseInt(url)
            arr.forEach((key) => {
                if (key['id'] == book_id) {
                    ans = JSON.stringify(key)
                }
            })
            if (ans.length == 0) {
                ans = 'topilmadi'
            }
    
            res.end(ans)
        } else if (url == '/add'){
            res.end(
                `<html>
                <form action="/books" method="POST">
                <input type="text" name="title" placeholder="title">
                <input type="text" name="author" placeholder="author">
                <button type="submit">Send data</button>
                </form>
                </html>
                `)
        }
    } else if (metod == "POST"){
        if(url.substring(0, 6) == '/books'){
            const body=[]
            req.on('data',(chunk)=>{
                body.push(chunk)
            })
            req.on('end',()=>{
                let Parsed=Buffer.concat(body).toString()
                console.log(Parsed);

                let Parsed_arr = Parsed.split('=') 
                let form_title = deco_rep(Parsed_arr[1].split("&")[0])
                let form_author = deco_rep(Parsed_arr[2]) 
                
                let has_title=false
                arr.forEach((v)=>{
                    if(v['title']==form_title){
                        has_title=true
                        
                    }
                })
               if(has_title==false){
                arr.push({ id:arr.length+1,title:form_title,'author':form_author})  
                  
                yozish(JSON.stringify(arr))
    
               } else{
                console.log(' has Title')
               }    
                
    
            })
           
            res.end()
        }
    } else if (metod == "PUT"){
        if(url.substring(0,6)==='/books'){
  
            url= url.substring(7)
        
            let edit_id1 = parseInt(url.split("?")[0])
        
            let bormi = false
            arr.forEach((v)=>{
                if (v['id'] == edit_id1){
                    bormi = true
                }
            })
        
            if (bormi){
                let f_title = url.split("?")[1]
                f_title = f_title.split("=")[1]
                f_title = f_title.split("&")[0]
                f_title = decodeURIComponent(f_title)
        
                let f_author = url.split("&")[1]
                f_author = f_author.split("=")[1]
                f_author = decodeURIComponent(f_author)
        
                arr[edit_id1-1]['title'] = f_title
                arr[edit_id1-1]['author'] = f_author
        
                yozish(JSON.stringify(arr))
                res.end("ok")
            } else {
                res.end("ma'lumot topilmadi")
            } 
        }
    } else if (metod == "DELETE"){
        if(url.substring(0,6)==='/books'){
  
            url= url.substring(7)
        
            let edit_id1 = parseInt(url.split("?")[0])
        
            let bormi = false
            arr.forEach((v)=>{
                if (v['id'] == edit_id1){
                    bormi = true
                }
            })
        
            if (bormi){
                console.log(arr)
        
                let new_arr = []
        
                arr.forEach((v)=>{
                    if (v['id'] != edit_id1){
                        new_arr.push({id: v['id'], title: v['title'], author: v['author']})
                    }
                })
                
                yozish(JSON.stringify(new_arr))
                res.end()
            } else {
                res.end("ma'lumot topilmadi")
            } 
        }
    }

 if(url.substring(0,5)==='/edit' && req.method==='GET'){
 url=url.substring(6)
 edit_id=parseInt(url)-1
  

 let l_author=arr[edit_id]['author']
 let l_title=arr[edit_id]['title']
 console.log(l_title)
 res.end(
    `<html>
    <form action="/books/${edit_id+1}" method="PUT">
    <input type="text" name="title" placeholder="title" value="${l_title}">
    <input type="text" name="author" placeholder="author" value="${l_author}">
    <button type="submit">Send data</button>
    </form>
    </html>
    `)
 }  

})


const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log('running on port' + PORT)
})