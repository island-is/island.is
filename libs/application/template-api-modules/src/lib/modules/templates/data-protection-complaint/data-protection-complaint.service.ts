import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { applicationToCaseRequest } from './data-protection-utils'
import {
  CaseApi,
  TokenMiddleware,
} from '@island.is/clients/data-protection-complaint'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { PdfFileProvider } from './attachments/providers/pdfFileProvider'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'
import { SharedTemplateApiService } from '../../shared'

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly applicationAttachmentProvider: ApplicationAttachmentProvider,
    private readonly pdfFileProvider: PdfFileProvider,
    private readonly sharedService: SharedTemplateApiService,
  ) {}

  get caseApiWithAuth() {
    return this.caseApi.withMiddleware(this.tokenMiddleware)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    try {
      const attachedFiles = await this.applicationAttachmentProvider.getFiles(
        ['complaint.documents', 'commissions.documents'],
        application,
      )

      const complaintPdf = await this.pdfFileProvider.getApplicationPdf(
        application,
        'kvörtun',
        attachedFiles,
      )

      if (!complaintPdf?.content) throw new Error('No pdf content')

      const key = await this.sharedService.addAttachment(
        application,
        'kvörtun.pdf',
        complaintPdf.fileBuffer,
        {
          ContentType: 'application/pdf',
        },
      )

      const attachments = [complaintPdf, ...attachedFiles]

      const caseRequest = await applicationToCaseRequest(
        application,
        attachments,
      )

      await this.caseApiWithAuth.createCase({
        requestData: caseRequest,
      })

      return {
        applicationPdfKey: key,
      }
    } catch (error) {
      this.logger.error('Error submitting', error)

      throw new Error('Villa kom kom upp við að senda umsókn')
    }
  }
}
