import * as AWS from 'aws-sdk'
import { environment } from '../../../../../environments'

const s3 = new AWS.S3()
const oneMinute = 60
const bucket = environment.fsS3Bucket ?? 'development-legal-residence-change'

export async function getFile(
  fileName: string,
): Promise<AWS.S3.GetObjectOutput> {
  const downloadParams = {
    Bucket: bucket,
    Key: fileName,
  }
  return await new Promise((resolve, reject) => {
    s3.getObject(downloadParams, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

export async function uploadFile(
  content: Buffer,
  fileName: string,
): Promise<void> {
  const uploadParams = {
    Bucket: bucket,
    Key: fileName,
    ContentEncoding: 'base64',
    ContentDisposition: 'inline',
    ContentType: 'application/pdf',
    Body: content,
  }

  await s3
    .upload(uploadParams)
    .promise()
    .catch(() => {
      return null
    })
}

export async function getPresignedUrl(fileName: string): Promise<string> {
  const presignedUrlParams = {
    Bucket: bucket,
    Key: fileName,
    Expires: oneMinute * 120, // TODO: Select length for presigned url's in island.is
  }

  return await new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', presignedUrlParams, (err, url) => {
      err ? reject(err) : resolve(url)
    })
  })
}
