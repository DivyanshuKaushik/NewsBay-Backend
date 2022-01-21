const AWS = require('aws-sdk')
const Response = require('./utils/Response')
const DB = new AWS.DynamoDB.DocumentClient()
const moment = require('moment')
const {uploadImage} = require('./utils/S3')

module.exports.handler = async(event)=>{
    try{
        const TableName = process.env.TableName
        if(event.httpMethod=='GET'){
            const {user,id} = event.queryStringParameters
            if(id){
                const params = {
                    TableName,
                    Key:{
                        pk:"NewsBay_Article",
                        sk:id
                    }
                }
                const data = await DB.get(params).promise().catch(e=>e)
                return Response(200,{article:data}) 
            }else{
                const params = {
                    TableName,
                    IndexName:"user-article-index",
                    KeyConditionExpression: '#user = :user AND begins_with(sk,:starts)',
                    ExpressionAttributeNames: {
                        "#user": "user",
                    },
                    ExpressionAttributeValues: {
                        ':user': `user_${user}`,
                        ':starts': 'article_',
                    },
                }
                const data = await DB.query(params).promise()
                return Response(200,{articles:data.Items.reverse()}) 
            }
        }
        if(event.httpMethod=='POST'){
            let { user,title,summary,source,image,category,tags,type,author } = JSON.parse(event.body)
            const generateId = ()=>{
                let date = new Date().toLocaleDateString().split('/').reverse().join("")
                let time = new Date().toTimeString().split(' ')[0].split(':').join('')
                return date.concat(time)
            }
            const articleId = generateId()
            user = `user_${user}`
            const sk = `article_${category}_${articleId}`
            const imageUrl = await uploadImage(image,sk)
            if(!imageUrl){
                return Response(422,{message:"Image Upload Failed!!"})
            }
            const params = {
                TableName,
                Item:{
                    pk: `NewsBay_Article`,
                    sk,
                    user,
                    id:articleId,
                    title,
                    summary,
                    source,
                    image:imageUrl,
                    category,
                    tags,
                    type,
                    author,
                    status:"submitted",
                    time: moment().format('LL'),
                }
            }
            const res = await DB.put(params).promise()
    
            return Response(201,{message:"Article created successfully!!",res,data:params.Item})
        }
        if(event.httpMethod=='PUT'){
            const {sk,updateKey,value} = JSON.parse(event.body)
            const params = {
                TableName,
                Key:{
                    pk:"NewsBay_Article",
                    sk
                },
                UpdateExpression: "set #updateKey = :value",
                ExpressionAttributeNames:{
                    "#updateKey":updateKey
                },
                ExpressionAttributeValues:{
                    ":value":value
                },
                ReturnValues:"UPDATED_NEW"
            };
           
            const res = await DB.update(params).promise()
            return Response(200,{message:`${updateKey} updated successfully!!`})
        }

    }catch(error){
       return Response(400,{error:"error"})
    }    
}