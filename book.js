const fs = require("fs")
const path = require("path")

const {parseRequestBody, saveToDatabaseAndRespond} = require("./helper")

const booksDbPath = path.join(__dirname, "db", "books.json")
let booksDB = JSON.parse(fs.readFileSync(booksDbPath,"utf8"))

function allBooks(){
    return new Promise ((resolve, reject) => {
        fs.readFile(booksDbPath, "utf8", (err, books) => {
            if (err){
                reject(err)
            }
            resolve(JSON.parse(books))
        })
    })
}


async function getAllBooks(req, res){
    fs.readFile(booksDbPath, "utf8", (err, books)=> {
        if (err){
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }
        res.writeHead(200)
        res.end(books);

    })
    
}

async function createBook(req, res) {
    parseRequestBody(req)  
    .then((newBookRequest)=>{
        const lastBook = booksDB[booksDB.length - 1]
        const lastBookId = lastBook.id
        newBookRequest.id = lastBookId + 1

        booksDB.push(newBookRequest)
        return saveToDatabaseAndRespond(booksDbPath, booksDB, res, newBookRequest, {message:"Could not save user to DB"})
    })
    .catch((err)=>{
        res.writeHead(400);
        res.end(JSON.stringify({
            message: 'Error parsing request body'
        }));
    })

}

async function getBook(req, res){
    parseRequestBody(req)
    .then((requestBody)=>{
        const id = requestBody.id
        allBooks()
        .then((booksJsonObj)=>{
            const bookIndex = booksJsonObj.findIndex(book => book.id === id)
            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }
            const bookFound = booksJsonObj[bookIndex]
            res.writeHead(200)
            res.end(JSON.stringify(bookFound))
        })
        .catch((err)=>{
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        })
   
    })
}

async function updateBook(req, res) {

    parseRequestBody(req)
    .then((detailsToUpdateRequest)=>{
        const bookId = detailsToUpdateRequest.id
        allBooks()
        .then((booksJsonObj)=>{
            const bookIndex = booksJsonObj.findIndex(book => book.id === bookId)
            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }
            const updatedBook = { ...booksJsonObj[bookIndex], ...detailsToUpdateRequest }
            booksJsonObj[bookIndex] = updatedBook
            return saveToDatabaseAndRespond(booksDbPath, booksJsonObj, res, "update sucessfully", {message:"Internal Server Error. Could not save book to database."})

        })
        .catch((err)=>{
            console.log(err)
            res.writeHead(400);
            res.end(JSON.stringify({
                message: 'Error parsing request body'
            }));
        })
    })
}

function deleteBook(req, res) {
    parseRequestBody(req)
    .then((requestBody)=>{
        const id = requestBody.id
        allBooks()
        .then((booksJsonObj)=>{
            const bookIndex = booksJsonObj.findIndex(book => book.id === id)
            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }
            booksJsonObj.splice(bookIndex, 1)
            return saveToDatabaseAndRespond(booksDbPath, booksJsonObj, res, "deleted sucessfully", {message:"Internal Server Error. Could not save book to database."})
        })
        .catch((err)=>{
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        })
   
    })
}

module.exports = {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook,
}

