const AWS = require('aws-sdk')
const DB = new AWS.DynamoDB.DocumentClient()
const Response = require('./utils/Response')

module.exports.handler = async event=>{
    try{
        if(!event.queryStringParameters){
            return Response(422,{message:"Please send valid queries!!"})
        }
        const TableName = process.env.TableName
        const {category,start,end,id} = event.queryStringParameters

        if(id && category){
            const params = {
                TableName,
                Key:{
                    pk:"NewsBay_Article",
                    sk:`article_${category}_${id}`
                }
            }
            const article = await DB.get(params).promise()
            return Response(200,{article:article.Item})
        }

        const params = {
            TableName,
            KeyConditionExpression: '#pk = :pk AND begins_with(sk,:starts)',
            FilterExpression:"#status = :stat",
            ExpressionAttributeNames: {
                "#pk": "pk",
                '#status':"status"
            },
            ExpressionAttributeValues: {
                ':pk': "NewsBay_Article",
                ':starts': `${category=='all'? 'article_': `article_${category}`}`,
                ':stat':"published"
            },
            ScanIndexForward: false
        }
            

        let articles = await DB.query(params).promise()

        if(!start || !end){
            return Response(200,{articles:articles.Items}) 
        }
        articles = articles.Items.slice(start,end)
        return Response(200,{articles})

    }catch(error){
        Response(500,{message:"Internal Server Error!!",error})
    }
}