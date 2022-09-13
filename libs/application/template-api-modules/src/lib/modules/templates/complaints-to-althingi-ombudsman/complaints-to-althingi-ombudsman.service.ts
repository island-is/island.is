import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG } from './config'
import type { ComplaintsToAlthingiOmbudsmanConfig } from './config'
import { generateConfirmationEmail } from './emailGenerators'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

@Injectable()
export class ComplaintsToAlthingiOmbudsmanTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(COMPLAINTS_TO_ALTHINGI_OMBUDSMAN_CONFIG)
    private complaintConfig: ComplaintsToAlthingiOmbudsmanConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN)
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      await this.sharedTemplateAPIService.sendEmail(
        (props) =>
          generateConfirmationEmail(
            props,
            this.complaintConfig.applicationSenderName,
            this.complaintConfig.applicationSenderEmail,
          ),
        application,
      )
      return null
    } catch (error) {
      this.logger.error(
        'Failed to send complaints to althingi ombudsman',
        error,
      )
      throw error
    }
  }
}
