const fs = require("fs").promises


//This function reads the body of a request line by line, conncatenate them and parse it to Json 
function parseRequestBody(req){
    return new Promise((resolve, reject)=>{
        const body = []
        req.on("data", (chunk)=>{
            body.push(chunk)
        })
    
        req.on("end", () => {
            try {
                const parsedBody = Buffer.concat(body).toString()
                const newParsedBody = JSON.parse(parsedBody)
                resolve(newParsedBody)
            }catch(err){
                reject(err)
            }
        })
    })
}

//This a helper function to handle response to the client, respond with respData/respMessage if any, OR errMessage if any
function handleResponse(res, options){
    if (!options){
        res.end()
        return
    }

    const {statusCode, respData, errMessage} = options
    if (statusCode){
        res.writeHead(statusCode)
    }

    if (respData){
        res.end(JSON.stringify(respData))
    }else if (errMessage){
        res.end(JSON.stringify({
            message: `Internal Server Error.${errMessage}.`
        }));
    }else{
        res.end()
    }

}

//This function save to DB and sends a response passed to it if any, Otherwise errMessage if an error is encountered
function saveToDatabaseAndRespond(filePath, data, res, respData, errMessage){
    return fs.writeFile(filePath, JSON.stringify(data))
        .then(()=>{
            handleResponse(res, {statusCode:200, respData})
        })
        .catch((err)=>{
            handleResponse(res, {statusCode:500, errMessage})
        })
}

module.exports = {
    parseRequestBody,
    saveToDatabaseAndRespond,
}