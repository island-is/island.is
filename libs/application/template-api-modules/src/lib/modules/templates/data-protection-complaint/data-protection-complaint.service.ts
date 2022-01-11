import { Inject, Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
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

@Injectable()
export class DataProtectionComplaintService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly applicationAttachmentProvider: ApplicationAttachmentProvider,
    private readonly pdfFileProvider: PdfFileProvider,
  ) {}

  get caseApiWithAuth() {
    return this.caseApi.withMiddleware(this.tokenMiddleware)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    try {
      const attachments = [
        ...(await this.pdfFileProvider.getFiles(application, 'kvörtun')),
        ...(await this.applicationAttachmentProvider.getFiles(
          ['complaint.documents', 'commissions.documents'],
          application,
        )),
      ]

      const caseRequest = await applicationToCaseRequest(
        application,
        attachments,
      )

      const newCase = await this.caseApiWithAuth.createCase({
        requestData: caseRequest,
      })
    } catch (error) {
      this.logger.error('Error submitting', error)

      throw new Error('Villa kom kom upp við að senda umsókn')
    }
  }
}
