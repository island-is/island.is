import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG,
  type ComplaintsToAlthingiOmbudsmanConfig,
} from './config'
import { generateConfirmationEmail } from './emailGenerators'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { CaseApi, TokenMiddleware } from '@island.is/clients/althingi-ombudsman'
import { ApplicationAttachmentProvider } from './attachments/providers/applicationAttachmentProvider'
import { applicationToCaseRequest } from './complaints-to-althingi-ombudsman.utils'

@Injectable()
export class ComplaintsToAlthingiOmbudsmanTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG)
    private readonly complaintConfig: ComplaintsToAlthingiOmbudsmanConfig,
    private readonly caseApi: CaseApi,
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly applicationAttachmentProvider: ApplicationAttachmentProvider,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
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
    const attachedFiles = complaintAttachedFiles.concat(
      commissionsAttachedFiles,
    )
    const caseRequest = await applicationToCaseRequest(
      application,
      attachedFiles,
    )
    await this.caseApi
      .withMiddleware(this.tokenMiddleware)
      .createCase({ requestData: caseRequest })
    // TODO: Check if email is still required, if so, fix email sender.
    //   await this.sharedTemplateAPIService.sendEmail(
    //     (props) =>
    //       generateConfirmationEmail(
    //         props,
    //         this.complaintConfig.applicationSenderName,
    //         this.complaintConfig.applicationSenderEmail,
    //       ),
    //     application,
    //   )
    return null
  }
}
