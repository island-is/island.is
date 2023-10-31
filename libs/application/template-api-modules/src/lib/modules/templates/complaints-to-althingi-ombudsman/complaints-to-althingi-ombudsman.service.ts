import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG,
  ComplaintsToAlthingiOmbudsmanConfig,
} from './config'
import { generateConfirmationEmail } from './emailGenerators'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  CaseApi,
  DocumentInfo,
  TokenMiddleware,
} from '@island.is/clients/althingi-ombudsman'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'
import { applicationToCaseRequest } from './complaints-to-althingi-ombudsman.utils'
import { generateComplaintPdf } from './pdfGenerators'
import { SharedTemplateApiService } from '../../shared'

@Injectable()
export class ComplaintsToAlthingiOmbudsmanTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG)
    private readonly complaintConfig: ComplaintsToAlthingiOmbudsmanConfig,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly applicationAttachmentProvider: ApplicationAttachmentProvider,
  ) {
    super(ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN)
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const complaintAttachedFiles =
      await this.applicationAttachmentProvider.getFiles(
        ['attachments.documents'],
        application,
      )
    const commissionsAttachedFiles =
      await this.applicationAttachmentProvider.getFiles(
        ['complainedForInformation.powerOfAttorney'],
        application,
      )
    const buffer = await generateComplaintPdf(application)
    const pdf = {
      content: buffer.toString('base64'),
      fileName: 'kvörtun',
      type: 'Kvörtun',
      subject: 'Kvörtun',
    } as DocumentInfo

    const attachedFiles = complaintAttachedFiles.concat(
      commissionsAttachedFiles,
    )
    const attachments = [pdf, ...attachedFiles]
    const caseRequest = await applicationToCaseRequest(application, attachments)
    await this.caseApi
      .withMiddleware(this.tokenMiddleware)
      .createCase({ requestData: caseRequest })
    // TODO: Check if email is still required, if so, fix email sender.
    // await this.sharedTemplateAPIService.sendEmail(
    //   (props) =>
    //     generateConfirmationEmail(
    //       props,
    //       this.complaintConfig.applicationSenderName,
    //       this.complaintConfig.applicationSenderEmail,
    //       pdf.toString('binary'),
    //     ),
    //   application,
    // )
    return null
  }
}
