'use strict';
const DB = require("./utils/Dynamo");
const Response = require('./utils/Response')

module.exports.handler = async (event) => {
    const tableName = process.env.TableName
    const category = await DB.queryBeginsWith('NewsBay-Category','category',tableName).catch(e=>e)
    // return {body:JSON.stringify({category})}
    return Response(200,{category})
};