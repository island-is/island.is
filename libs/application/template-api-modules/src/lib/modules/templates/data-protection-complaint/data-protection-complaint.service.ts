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
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class DataProtectionComplaintService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly applicationAttachmentProvider: ApplicationAttachmentProvider,
    private readonly pdfFileProvider: PdfFileProvider,
    private readonly sharedService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT)
  }

  get caseApiWithAuth() {
    return this.caseApi.withMiddleware(this.tokenMiddleware)
  }

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const complaintAttachedFiles =
      await this.applicationAttachmentProvider.getFiles(
        ['complaint.documents'],
        application,
      )

    const commissionsAttachedFiles =
      await this.applicationAttachmentProvider.getFiles(
        ['commissions.documents'],
        application,
      )

    const attachedFiles = complaintAttachedFiles.concat(
      commissionsAttachedFiles,
    )

    const complaintPdf = await this.pdfFileProvider.getApplicationPdf(
      application,
      'kvörtun',
      attachedFiles,
    )

    if (!complaintPdf?.content) throw new Error('No pdf content')

    const now = new Date()
    const nowString = now.toISOString().replace(/:/g, '-')
    const complaintPdfFileName = `kvörtun-${nowString}.pdf`

    const key = await this.sharedService.addAttachment(
      application,
      complaintPdfFileName,
      complaintPdf.fileBuffer,
      {
        ContentType: 'application/pdf',
      },
    )

    const attachments = [complaintPdf, ...attachedFiles]

    const caseRequest = await applicationToCaseRequest(application, attachments)

    await this.caseApiWithAuth.createCase({
      requestData: caseRequest,
    })

    return {
      applicationPdfKey: key,
    }
  }
}
