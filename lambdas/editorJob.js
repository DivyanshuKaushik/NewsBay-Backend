const AWS = require('aws-sdk')
const Response = require('./utils/Response')
// const { deleteImage } = require('./utils/S3')
const DB = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async event =>{
    try{
        const TableName = process.env.TableName

        if(event.path=="/getUnpublishedPosts"){
            const params = {
                TableName,
                KeyConditionExpression: '#pk = :pk AND begins_with(sk,:starts)',
                FilterExpression:"#status <> :stat",
                ExpressionAttributeNames: {
                    "#pk": "pk",
                    "#status":"status"
                },
                ExpressionAttributeValues: {
                    ':pk': "NewsBay_Article",
                    ':starts': 'article_',
                    ':stat':"published"
                },
                ScanIndexForward: false
            }
            const data = await DB.query(params).promise()
            return Response(200,{articles:data.Items}) 
        }
        if(event.path=="/postStatus"){

            let {sk,status} = JSON.parse(event.body)
            const params = {
                TableName,
                Key:{
                    pk:"NewsBay_Article",
                    sk:sk
                },
                UpdateExpression: "set #stat = :status",
                ExpressionAttributeNames:{
                    "#stat":"status"
                },
                ExpressionAttributeValues:{
                    ":status":status
                },
                ReturnValues:"UPDATED_NEW"
            };
           
            const res = await DB.update(params).promise()
           
            return Response(200,{message:`Article ${status}!!`,res})

        }
        // if(event.path==`/deletePost`){
        //     const {id,image} = event.queryStringParameters
        //     const img_name = image.split('.com/')[1]
        //     // const delete_img = await deleteImage(img_name)
        //     const delete_img = false
        //     if(!delete_img){
        //         return Response(400,{message:"Error Deleting Article!!"})
        //     }
        //     const params = {
        //         TableName,
        //         Key:{
        //             pk:"NewsBay_Article",
        //             sk:id
        //         }
        //     }
        //     const res = await DB.delete(params).promise()
        //     return Response(200,{message:"Article deleted successfully!!"}) 
        // }

    }catch(error){
        return Response(400,{error})
    }
}