const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient()
const Response = require('./Response')
const DB = {
    async scan(TableName){
        const params = {
            TableName,
        }
        const data = await docClient.scan(params).promise()
        if(!data || !data.Items){
            throw Error("There was an error while fetching data")
        }
        return data.Items
    },
    async get(pk,sk,TableName){
        const params = {
            TableName,
            Key:{
                pk,sk
            }
        }
        const data = await docClient.get(params).promise()
        if(!data || !data.Item){
            throw Error("There was an error while fetching data")
        }
        return data.Item
    },
    async queryBeginsWith(pk,sk,TableName){
        const params = {
            TableName,
            KeyConditionExpression: 'pk = :pk AND begins_with(sk,:starts)',
            ExpressionAttributeValues: {
                ':pk': pk,
                ':starts': sk,
            }
        }
        const data = await docClient.query(params).promise()
        return data.Items.reverse()
    },
    async queryUser(user,sk,TableName){
        const params = {
            TableName,
            IndexName:"user-article-index",
            KeyConditionExpression: '#user = :user AND begins_with(sk,:starts)',
            ExpressionAttributeNames: {
                "#user": "user",
            },
            ExpressionAttributeValues: {
                ':user': user,
                ':starts': sk,
            },
        }
        const data = await docClient.query(params).promise()
        return data.Items.reverse()
    },
    async put(data,TableName){
        const params = {
            TableName,
            Item:data
        }
        const res = await docClient.put(params).promise()
        if(!res){
            throw Error("There was an error while adding data")
        }
        return data
    },
    async update(pk,sk,updateKey,updatevalue,TableName){
        try{
            const params = {
                TableName,
                Key:{
                    pk,sk
                },
                UpdateExpression: "set #updateKey = :value",
                ExpressionAttributeNames:{
                    "#updateKey":updateKey
                },
                ExpressionAttributeValues:{
                    ":value":updatevalue
                },
                ReturnValues:"UPDATED_NEW"
            };
           
            const res = await docClient.update(params).promise()
            if(!res){
                throw Error("There was an error while adding data")
            }
            return res
        }catch(error){
            Response(400,{error})
        }
    },
    async delete(pk,sk,TableName){
        const params = {
            TableName,
            Key:{
                pk,
                sk
            }
        }
        const res = await docClient.delete(params).promise()
        if(!res){
            throw Error("There was an error while adding data")
        }
        return res
    }
}
module.exports = DB; 