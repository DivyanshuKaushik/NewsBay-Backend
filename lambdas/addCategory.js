'use strict';

const DB = require("../utils/Dynamo");
const Response = require("../utils/Response");

module.exports.handler = async (event) => {
    const tableName = process.env.tableName
  try{
    const {category} = JSON.parse(event.body)
    const newCategory = {
        pk:`NewsBay-Category`,
        sk:`category#${category}`,
        category
    }
    const save = await DB.put(newCategory,tableName).catch(e=>e)
    return Response(201,{message:"Created New Category Successfully"})
  }catch(err){
      return Response(400,{message:"error"})
  }
};
