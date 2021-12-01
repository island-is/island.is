import { Inject, Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { applicationToCaseRequest } from './data-protection-utils'
import {
  CaseApi,
  TokenMiddleware,
} from '@island.is/clients/data-protection-complaint'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { DataProtectionComplaintAttachmentProvider } from './data-protection-attachments.provider'
import { PdfFileProvider } from './attachments/providers/pdfFileProvider'
import { S3UploadFileProvider } from './attachments/providers/applicationFileProvider'
import { Attachment } from './models/attachments'

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly caseApi: CaseApi,
    private readonly dataProtectionComplaintAttachmentProvider: DataProtectionComplaintAttachmentProvider,
    private readonly tokenMiddleware: TokenMiddleware,
  ) {}

  get caseApiWithAuth() {
    return this.caseApi.withMiddleware(this.tokenMiddleware)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const pdfFileProvider = new PdfFileProvider(application, 'application')
    const s3FileProvider = new S3UploadFileProvider(application, [
      'complaint.documents',
      'commissions.documents',
    ])
    console.log('here 1')
    const attachments = [
      ...(await pdfFileProvider.getFiles()),
      // ...(await s3FileProvider.getFiles()),
    ]
    console.log('here 2')
    const caseRequest = await applicationToCaseRequest(application, attachments)
    console.log('here 3')
    console.log(caseRequest)
    const newCase = await this.caseApiWithAuth.createCase({
      requestData: caseRequest,
    })

    console.log('new case : ', newCase)

    const getnewCase = await this.caseApiWithAuth.getCase({
      requestData: { caseNumber: newCase.identifier },
    })
    console.log('new case : ', getnewCase)
    throw new Error('STOP APPLICATION FROM SUBMITTING ')
  }
}
