'use strict';

const DB = require("../utils/Dynamo");
const Response = require("../utils/Response");

module.exports.handler = async (event) => {
    const tableName = process.env.tableName
  try{
    const category = await DB.queryBeginsWith('NewsBay-Category','category',tableName).catch(e=>e)
    return Response(200,{category})
  }catch(err){
      return Response(400,{message:"error"})
  }
};