const http = require('http')
const fs = require('fs')
const path = require('path')
const { title } = require('process')
let arr = []
let book_id = 0
let ans = ''
let last_id=1
let edit_id=0


/*
* books.jsonni o'qib arrayga aylantirib beradi
* @return books.json array holatida
*/
fs.readFile(path.join(__dirname, 'books.json'), 'utf-8', (err, data) => {
    if (err) throw err
    arr = JSON.parse(data)
})



const server = http.createServer((req, res) => {
    let url = req.url
   
    if(url=='/'){
        res.end('Node js repetetation')
    }





  
/* part second 
* url =/booksga va method get bo'lgandagi qismi
*
*/
   if (url === '/books' && req.method==="GET"){
        res.end(JSON.stringify(arr))        
    } 
    else if (url.substring(0, 6) == '/books' && req.method==="GET") {
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
    } 

   //books start here
   /* 
   *
   *Part third bu yerrda ma'lumot qo'shdim
   *
   */
    if(url==='/add')
    res.end(
    `<html>
    <form action="/books" method="POST">
    <input type="text" name="title" placeholder="title">
    <input type="text" name="author" placeholder="author">
    <button type="submit">Send data</button>
    </form>
    </html>
    `)
    
    if(url.substring(0, 6) == '/books' && req.method==='POST'){
        const body=[]
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        req.on('end',()=>{
            const Parsed=Buffer.concat(body).toString()
            
            const Parsed_arr = Parsed.split('=') 
            const form_title = Parsed_arr[1].split("&")[0]
            const form_author = Parsed_arr[2]           
           

            console.log('title: ' + form_title)
            console.log('author: ' + form_author)
     
     /* 
     *@Method GET
     * title uxshashlik shu yerda tekshirilmoqda
     * req: /add
     */   

            let has_title=false
            arr.forEach((v)=>{
                if(v['title']==form_title){
                    has_title=true
                    
                }
            })
           if(has_title==false){
            arr.push({ id:arr.length+1,title:form_title,'author':form_author})  
              
            fs.writeFile(path.join(__dirname,'books.json'),JSON.stringify(arr),(err)=>{
           
            })

           }
           else{
            console.log(' has Title')
           }        
            

        })
       
        res.end()
    }
 // GET method ends her
/*
* Method PUT
*  id orqali thrirlash
 */

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


 if(url.substring(0,6)==='/books' && req.method==='PUT'){
  
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

        fs.writeFile(path.join(__dirname,'books.json'),JSON.stringify(arr),(err)=>{
           
        })
        res.end("ok")
    } else {
        res.end("ma'lumot topilmadi")
    } 
}
 /*  
 * Put request end her
 */
   
 if(url.substring(0,6)==='/books' && req.method==='DELETE'){
  
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
        
        fs.writeFile(path.join(__dirname,'books.json'),JSON.stringify(new_arr),(err)=>{
           
        })
        res.end()
    } else {
        res.end("ma'lumot topilmadi")
    } 
}
 
})


const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log('running on port' + PORT)
})