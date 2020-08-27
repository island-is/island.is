import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'

const uploadBucket = 'testing-islandis' // TODO get from env and update to correct bucket

AWS.config.update({ region: 'eu-west-1' })

@Injectable()
export class FileStorageService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' })

  generatePresignedPost(filename: string): Promise<AWS.S3.PresignedPost> {
    const fileId = uuid()
    console.log('generatePresignedPost with id: ', `${filename}_${fileId}`)

    const params = {
      Bucket: uploadBucket,
      Expires: 10000000, //time to expire in seconds, TODO select length

      Fields: {
        key: `${fileId}_${filename}`,
      },
      conditions: [['content-length-range', 0, 100000]],
    }

    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async copyObjectFromUploadBucket(
    key: string,
    destinationBucket: string,
    region: string,
    sourceBucket: string,
  ): Promise<String> {
    const params = {
      Key: key,
      Bucket: destinationBucket,
      CopySource: `${sourceBucket}/${key}`,
    }

    return new Promise((resolve, reject) => {
      this.s3.copyObject(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const url = `https://${destinationBucket}.s3-${region}.amazonaws.com/${key}`

          resolve(url)
        }
      })
    })
  }
}
