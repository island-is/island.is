import { utils } from '@island.is/application/templates/accident-notification'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import type { AccidentNotificationConfig } from './config'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class AccidentNotificationService {
  constructor(
    @Inject(ACCIDENT_NOTIFICATION_CONFIG)
    private accidentConfig: AccidentNotificationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const shouldRequestReview =
      !utils.isHomeActivitiesAccident(application.answers) &&
      !utils.isRepresentativeOfCompanyOrInstitute(application.answers)

    // Send confirmation email to applicant
    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateConfirmationEmail(
          props,
          this.accidentConfig.applicationSenderName,
          this.accidentConfig.applicationSenderEmail,
        ),
      application,
    )

    // Request representative review when applicable
    if (shouldRequestReview) {
      await this.sharedTemplateAPIService.assignApplicationThroughEmail(
        generateAssignReviewerEmail,
        application,
        SIX_MONTHS_IN_SECONDS_EXPIRES,
      )
    }
  }
}
