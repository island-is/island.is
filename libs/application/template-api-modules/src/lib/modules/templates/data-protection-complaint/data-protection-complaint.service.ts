import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateApplicationPdf } from './pdfGenerators'
import AWS from 'aws-sdk'
import { transformApplicationToComplaintDto } from './data-protection-utils'
import {
  //CaseApi,
  ClientsApi,
} from '@island.is/clients/data-protection-complaint'

@Injectable()
export class DataProtectionComplaintService {
  s3: AWS.S3
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    //private readonly caseApi: CaseApi,
    private readonly clientsApi: ClientsApi,
  ) {
    this.s3 = new AWS.S3()
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    /* const buffer = await generateApplicationPdf(
      transformApplicationToComplaintDto(application),
    )*/
    console.log('Application sending ....')
    const stuff = await this.clientsApi.getContact({
      requestData: { searchText: 'T' },
    })
    console.log('Stuff below ....')
    console.log(stuff)

    if (stuff.returnCode !== 200) throw new Error(stuff.message)
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
