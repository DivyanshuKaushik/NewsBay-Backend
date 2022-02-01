const AWS = require('aws-sdk')
const DB = new AWS.DynamoDB.DocumentClient()
const Response = require('./utils/Response')

module.exports.handler = async event=>{
    try{
        const TableName = process.env.TableName
        const {category,start,end,id} = event.queryStringParameters

        if(id){
            const params = {
                TableName,
                Key:{
                    pk:"NewsBay_Article",
                    sk:`article_${id}`
                }
            }
            const article = await DB.get(params).promise()
            return Response(200,article.Item)
        }
        if(category){
            const params = {
                TableName,
                KeyConditionExpression: '#pk = :pk AND begins_with(sk,:starts)',
                FilterExpression:"#status = :stat AND #cat = :cat",
                ExpressionAttributeNames: {
                    "#pk": "pk",
                    '#status':"status",
                    "#cat":"category"
                },
                ExpressionAttributeValues: {
                    ':pk': "NewsBay_Article",
                    ':starts': 'article_',
                    ':stat':"published",
                    ':cat':category
                },
                ScanIndexForward: false
            }
                
            let articles = await DB.query(params).promise()
    
            if(!start || !end){
                return Response(200,articles.Items) 
            }
            articles = articles.Items.slice(start,end)
            return Response(200,articles)
        }

        const params = {
            TableName,
            KeyConditionExpression: '#pk = :pk AND begins_with(sk,:starts)',
            FilterExpression:"#status = :stat",
            ExpressionAttributeNames: {
                "#pk": "pk",
                '#status':"status",
            },
            ExpressionAttributeValues: {
                ':pk': "NewsBay_Article",
                ':starts': 'article_',
                ':stat':"published",
            },
            ScanIndexForward: false
        }
            
        let articles = await DB.query(params).promise()

        if(!start || !end){
            return Response(200,articles.Items) 
        }
        articles = articles.Items.slice(start,end)
        return Response(200,articles)


    }catch(error){
        Response(500,{message:"Internal Server Error!!",error})
    }
}