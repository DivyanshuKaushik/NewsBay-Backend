const DB = require("./utils/Dynamo");
const Response = require("./utils/Response");

module.exports.handler = async (event) => {
    const tableName = process.env.TableName
  
    const {category} = JSON.parse(event.body)
    const newCategory = {
        pk:`NewsBay-Category`,
        sk:`category_${category}`,
        data:{
          category
        }
    }
    const save = await DB.put(newCategory,tableName).catch(e=>e)
    // return {body:JSON.stringify({message:"Created New Category Successfully"})}
    return Response(201,{message:"Created New Category Successfully",category:newCategory})
  
};
