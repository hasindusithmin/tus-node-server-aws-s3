require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucket_name = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_DEFAULT_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const client = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


//upload a file to s3
module.exports.UploadImage = (filename, filepath) => {
    const file_stream = fs.createReadStream(filepath)
    const params = {
        Bucket: bucket_name,
        Body: file_stream,
        Key: filename
    }
    return client.upload(params).promise()
}


//download a file from s3
module.exports.DownloadImage = (filekey) => {
    const params = {
        Bucket: bucket_name,
        Key: filekey
    }
    return client.getObject(params).createReadStream()
}



