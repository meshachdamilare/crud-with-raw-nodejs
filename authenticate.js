const fs = require("fs")
const path = require("path")

const {parseRequestBody} = require("./helper")
const {allUsers} = require("./users")

function authenticateUser(req, res){
    return new Promise ((resolve, reject)=>{
        parseRequestBody(req)
            .then( async (loginDetails)=>{
                if (!newUser){
                    reject("Please enter your username and password")
                }

                const users =  await allUsers()
                const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password);

                if (!userFound){
                    reject("Username or Password incorrrect")
                }

                resolve(userFound)

            })
    })
}

module.exports = {
    authenticateUser
}