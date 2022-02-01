const DB = require("./utils/Dynamo");
const Response = require("./utils/Response");

module.exports.handler = async (event) => {
    const tableName = process.env.TableName
  
    if(event.httpMethod == 'POST'){
      const {category} = JSON.parse(event.body)
      const newCategory = {
          pk:`NewsBay_Category`,
          sk:`category_${category}`,
          category
      }
      const save = await DB.put(newCategory,tableName).catch(e=>e)
      // return {body:JSON.stringify({message:"Created New Category Successfully"})}
      return Response(201,{message:"Created New Category Successfully",category:newCategory})
    }
    if(event.httpMethod == 'DELETE'){
      const {category} = event.pathParameters
      const sk =`category_${category}`,
      const delCat = await DB.delete('NewsBay_Category',sk,tableName).catch(e=>e)
      return Response(202,{message:"Deleted Category Successfully"})
    }

  
};
