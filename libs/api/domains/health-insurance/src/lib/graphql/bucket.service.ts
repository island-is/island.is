import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { ListObjectsOutput } from 'aws-sdk/clients/s3'
import * as S3 from 'aws-sdk/clients/s3'

const BUCKET_NAME = 'dev-island-is-sjukra'
const REGION = 'eu-west-1'

const s3 = new AWS.S3({
  region: REGION,
})

@Injectable()
export class BucketService {
  constructor() {}

  /* TEST */
  async btest(): Promise<string | undefined> {
    this.getList()
    let sm = await this.getFile('smasaga.txt')
    return sm.Body?.toString()
  }

  /* TEST */
  getList = async (): Promise<ListObjectsOutput> => {
    const list = await s3.listObjects({ Bucket: BUCKET_NAME }).promise()
    // console.log('---->' + JSON.stringify(list, null, 2))
    return list
  }

  /* TEST */
  getFile = async (fileToGet: string): Promise<S3.GetObjectOutput> => {
    return new Promise((resolve, reject) => {
      s3.createBucket(
        {
          Bucket: BUCKET_NAME,
        },
        function () {
          const params = {
            Bucket: BUCKET_NAME,
            Key: fileToGet,
          }
          s3.getObject(params, function (err, data) {
            if (err) {
              reject(err)
            } else {
              // console.log('Successfully dowloaded data from  bucket')
              // console.log(data.Body?.toString())
              resolve(data)
            }
          })
        },
      )
    })
  }
}
