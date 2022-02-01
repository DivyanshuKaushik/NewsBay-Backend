const Response = (code,data)=>{
    return {
        headers: {
                 'Access-Control-Allow-Methods':'*',
                 'Access-Control-Allow-Origin':'*',
                 "Access-Control-Allow-Headers":"*",
                 'Access-Control-Allow-Credentials': true,
        },
        statusCode:code,
        body:JSON.stringify(data)
    }
}
module.exports = Response