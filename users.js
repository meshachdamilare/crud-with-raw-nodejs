const fs = require("fs")
const path = require("path")

const {parseRequestBody, saveToDatabaseAndRespond} = require("./helper")

const userDbPath = path.join(__dirname, "db", "users.json")
let usersDB = JSON.parse(fs.readFileSync(userDbPath,"utf8"))

function allUsers(){
    return new Promise ((resolve, reject) => {
        fs.readFile(userDbPath, "utf8", (err, users) => {
            if (err){
                reject(err)
            }
            resolve(JSON.parse(users))
        })
    })
}

async function getAllUSers(req, res){
    fs.readFile(userDbPath, "utf8", (err, users)=> {
        if (err){
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.writeHead(200)
        res.end(users);

    })
    
}


function createUser(req, res) {
    parseRequestBody(req)
    
    .then((newUserRequest)=>{
        const lastUser = usersDB[usersDB.length - 1]
        const lastUserId = lastUser.id
        newUserRequest.id = lastUserId + 1

        usersDB.push(newUserRequest)
        return saveToDatabaseAndRespond(userDbPath, usersDB, res, newUserRequest, {message:"Could not save user to DB"})
    })
    .catch((err)=>{
        console.log(err)
        res.writeHead(400);
        res.end(JSON.stringify({
            message: 'Error parsing request body'
        }));
    })

}

module.exports = {
    allUsers,
    getAllUSers,
    createUser,
    userDbPath, 
    usersDB
}

