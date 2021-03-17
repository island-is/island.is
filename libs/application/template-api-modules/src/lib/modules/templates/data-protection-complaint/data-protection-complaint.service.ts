import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateApplicationPdf } from './pdfGenerators'
import AWS from 'aws-sdk'
import { transformApplicationToComplaintDto } from './data-protection-utils'

@Injectable()
export class DataProtectionComplaintService {
  s3: AWS.S3
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,

  ) {
    this.s3 = new AWS.S3()
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    const buffer = await generateApplicationPdf(transformApplicationToComplaintDto(application))
    //await this.uploadFile(buffer, 'testing-islandis-sen', 'applicaton.pdf')
  }

  async uploadFile(
    content: Buffer,
    bucket: string,
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
    try {
      const res = await this.s3.upload(uploadParams).promise()
      console.log(res)
    } catch (er) {
      console.log(er)
    }
  }
}
