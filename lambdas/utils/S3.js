const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const BucketName = process.env.BucketName
// const sharp = require('sharp')

const uploadImage = (image,name) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const allowedExt = ['image/jpg','image/jpeg','image/png','image/webp']
            if (!image) {
                throw new Error('No Image!!');
            }
    
            const mimType = image.split(';')[0].split(':')[1]
    
            if(!allowedExt.includes(mimType)){
                throw new Error('File Type Not Supported!!');
            }
    
            const image_data_as_base64 = image.replace(/^data:image\/\w+;base64,/,'')
            const decoded_image = Buffer.from(image_data_as_base64,'base64')
            // const optimized_image = await sharp(decoded_image).webp().toBuffer()
            const optimized_image = decoded_image
    
            const key = `${name}.webp`
    
            const upload = await s3
                .upload({
                    Bucket: BucketName,
                    Body: optimized_image,
                    Key: key,
                    ContentType: "image/webp",
                    ACL: 'public-read'
                })
                .promise();
            return resolve(upload.Location)
            
        }catch(error){
            return reject(error)
        }
    })
}

const deleteImage = (name) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const params = {
                Bucket:BucketName,
                Key:name
            }
            const remove = await s3.deleteObject(params).promise()
            if(!remove){
                throw new Error("Error")
            }
            return resolve("Image Deleted Successfully!!")
            
        }catch(error){
            return reject(Error("Error Deleting Image!!"))
        }
    })
}

module.exports = {uploadImage ,deleteImage}