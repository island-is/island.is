import { getValueViaPath } from '@island.is/application/core'
import {
  AccidentNotificationAnswers,
  ReviewApprovalEnum,
  SubmittedApplicationData,
  utils,
} from '@island.is/application/templates/accident-notification'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { AttachmentProvider } from './accident-notification-attachments.provider'
import {
  applictionAnswersToXml,
  getApplicationDocumentId,
} from './accident-notification.utils'
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

    console.log('XML OBJEJCJTWS', xml)
    try {
      const { ihiDocumentID } = await this.documentApi.documentPost({
        document: { doc: xml, documentType: 801 },
      })

      await this.sharedTemplateAPIService.sendEmail(
        (props) =>
          generateConfirmationEmail(
            props,
            this.accidentConfig.applicationSenderName,
            this.accidentConfig.applicationSenderEmail,
            ihiDocumentID,
          ),
        application,
      )

      // Request representative review when applicable
      if (shouldRequestReview) {
        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          (props, assignLink) =>
            generateAssignReviewerEmail(props, assignLink, ihiDocumentID),
          application,
          SIX_MONTHS_IN_SECONDS_EXPIRES,
        )
      }
      return {
        documentId: ihiDocumentID,
      }
    } catch (e) {
      console.log('ERROR', e)
      throw new Error('Villa kom upp við vistun á umsókn.')
    }
  }

  async addAdditionalAttachment({ application }: TemplateApiModuleActionProps) {
    console.log('adding attachment')
    console.log('top application: ', application)
    const attachments = await this.attachmentProvider.gatherAllAttachments(
      application,
    )

    console.log('attachments', attachments)

    const documentId = getApplicationDocumentId(application)
    //Send multiple attachments
    const promises = attachments.map((attachment) =>
      this.documentApi.documentDocumentAttachment({
        documentAttachment: {
          attachmentBody: attachment.content,
          attachmentType: attachment.attachmentType,
          title: attachment.name,
        },
        ihiDocumentID: documentId,
      }),
    )

    const result = await Promise.all(promises)
    console.log('attachment added', result)
  }
  async reviewApplication({ application }: TemplateApiModuleActionProps) {
    const documentId = getApplicationDocumentId(application)

    const isRepresentativeOfCompanyOrInstitue = utils.isRepresentativeOfCompanyOrInstitute(
      application.answers,
    )
    const reviewApproval = getValueViaPath(
      application.answers,
      'reviewApproval',
    ) as ReviewApprovalEnum

    await this.documentApi.documentSendConfirmation({
      ihiDocumentID: documentId,
      confirmationType: reviewApproval === ReviewApprovalEnum.APPROVED ? 1 : 2,
      confirmationParty: isRepresentativeOfCompanyOrInstitue ? 2 : 1,
    })
  }
}
