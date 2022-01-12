const Response = (statusCode,data={})=>{
    return {
        headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Methods':'*',
             'Access-Control-Allow-Origin':'*'
        },
        ștatusCode:statusCode,
        body: JSON.stringify(data)
    }
}
module.exports = Response