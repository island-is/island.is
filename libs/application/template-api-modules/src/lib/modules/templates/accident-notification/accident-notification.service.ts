import {
  AccidentNotificationAnswers,
  utils,
} from '@island.is/application/templates/accident-notification'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import { Inject, Injectable } from '@nestjs/common'
import fetch from 'node-fetch'
import { Exception } from 'handlebars'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { AttachmentProvider } from './accident-notification-attachments.provider'
import { applictionAnswersToXml } from './accident-notification.utils'
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
    private readonly attachmentProvider: AttachmentProvider,
    private readonly documentApi: DocumentApi,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const shouldRequestReview =
      !utils.isHomeActivitiesAccident(application.answers) ||
      !utils.isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers)

    const attachments = await this.attachmentProvider.gatherAllAttachments(
      application,
    )

    const answers = application.answers as AccidentNotificationAnswers
    console.log('answers', answers)
    const xml = applictionAnswersToXml(answers, attachments)

    console.log('XML ', xml)
    try {
      const {
        success,
        errorDesc,
        errorList,
        ihiDocumentID,
        numberIHI,
      } = await this.documentApi.documentPost({
        document: { doc: xml, documentType: 801 },
      })
      console.log('hahahahaha')
      console.log('success', success)
      console.log('errorDesc', errorDesc)
      console.log('errorList', errorList)
      console.log('ihiDocumentID', ihiDocumentID)
      console.log('numberIHI', numberIHI)
    } catch (error) {
      console.log('error', error.status)
      //check if errorcode is in 400 range
      if (error.status >= 400 && error.status < 500) {
        console.log('error', error.body)
        throw new Exception(error.body.errorDesc)
      }
    }

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
