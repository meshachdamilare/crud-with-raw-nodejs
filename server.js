const http = require("http")
const fs = require("fs")

const {getAllUSers, createUser} = require("./users")
const { getAllBooks, createBook, getBook, updateBook, deleteBook } = require("./book")

const PORT = 8000
const HOSTNAME = "localhost"

const requesHandler = function (req, res){
    res.setHeader("Content-Type", "application/json");


    if (req.url === "/" && req.method === "GET"){
        res.writeHead(200)
        res.end("Welcome to Core node server")
        return
    }else if (req.url === '/users' && req.method === 'GET'){
        getAllUSers(req, res)
    }else if (req.url==='/users' && req.method ==='POST'){
        createUser(req, res)
    }else if (req.url==='/books' && req.method ==='GET'){
        getAllBooks(req, res)
    }else if (req.url==='/books' && req.method ==='POST'){
        createBook(req, res)
    }else if (req.url==='/book' && req.method ==='GET'){
        getBook(req, res)
    }else if (req.url==='/book' && req.method ==='PUT'){
        updateBook(req, res)
    }else if (req.url==='/book' && req.method ==='DELETE'){
        deleteBook(req, res)
    }else {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: 'Method Not Supported'
        }));
    }

}

const server = http.createServer(requesHandler)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is listening on ${HOSTNAME}:${PORT}`)
})