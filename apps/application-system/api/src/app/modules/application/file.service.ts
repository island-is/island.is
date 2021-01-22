import { Injectable } from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'

@Injectable()
export class FileService {
  private s3 = new AWS.S3()

  constructor(
  ) {}

  async createResidenceChangePdf(
    childrenAppliedFor: [{name: string, ssn: string}],
    parentA: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
    parentB: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
    expiry: string
    ): Promise<string> {
      const pdfBuffer = await generateResidenceChangePdf(childrenAppliedFor, parentA, parentB, expiry)

      const id = uuid()
      const fileName = `${parentA.ssn}/${id}.pdf`
      // TODO: Change local to environment
      const bucket = 'local-legal-residence-change'

      await this.uploadFileToS3(pdfBuffer, bucket, fileName)

      const presignedUrl =  await this.createPresignedUrl(bucket, fileName)

      return presignedUrl
  }

  private async uploadFileToS3(buffer: Buffer, bucket: string, fileName: string) {
    const params = {
        Bucket: bucket,
        Key: fileName,
        ContentEncoding: 'base64',
        ContentDisposition: 'inline',
        Body: buffer
      };

    await this.s3
      .upload(params)
      .promise()
      .catch((error) => {
        throw error
      })
  }

  private async createPresignedUrl(bucket: string, filename: string): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: filename,
      Expires: 60 * 20
    };

    return await new Promise((resolve, reject) => {
        this.s3.getSignedUrl('getObject', params, (err, url) => {
          err ? reject(err) : resolve(url);
        });
      });
  }
}
