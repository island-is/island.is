import { getValueViaPath } from '@island.is/application/core'
import {
  AccidentNotificationAnswers,
  ReviewApprovalEnum,
  utils,
} from '@island.is/application/templates/accident-notification'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { AttachmentProvider } from './accident-notification-attachments.provider'
import {
  applictionAnswersToXml,
  attachmentStatusToAttachmentRequests,
  getApplicationAttachmentStatus,
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
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(ACCIDENT_NOTIFICATION_CONFIG)
    private accidentConfig: AccidentNotificationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentProvider: AttachmentProvider,
    private readonly documentApi: DocumentApi,
  ) {}

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const shouldRequestReview =
      !utils.isHomeActivitiesAccident(application.answers) &&
      !utils.isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers)

    const requests = attachmentStatusToAttachmentRequests()

    const attachments = await this.attachmentProvider.gatherAllAttachments(
      application,
      requests,
    )

    const answers = application.answers as AccidentNotificationAnswers
    const xml = applictionAnswersToXml(answers, attachments)
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
      this.logger.error('Error submitting application to SÍ', { e })
      throw new Error('Villa kom upp við vistun á umsókn.')
    }
  }

  async addAdditionalAttachment({ application }: TemplateApiModuleActionProps) {
    try {
      const attachmentStatus = getApplicationAttachmentStatus(application)
      const requests = attachmentStatusToAttachmentRequests(attachmentStatus)

      const attachments = await this.attachmentProvider.gatherAllAttachments(
        application,
        requests,
      )

      const documentId = getApplicationDocumentId(application)

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

      await Promise.all(promises)
    } catch (e) {
      this.logger.error('Error adding attachment to SÍ', { e })
      throw new Error('Villa kom upp við að bæta við viðhengi.')
    }
  }
  async reviewApplication({ application }: TemplateApiModuleActionProps) {
    try {
      const documentId = getApplicationDocumentId(application)

      const isRepresentativeOfCompanyOrInstitue = utils.isRepresentativeOfCompanyOrInstitute(
        application.answers,
      )
      const reviewApproval = getValueViaPath(
        application.answers,
        'reviewApproval',
      ) as ReviewApprovalEnum
      const reviewComment =
        getValueViaPath(application.answers, 'reviewComment') || ''
      await this.documentApi.documentSendConfirmation({
        ihiDocumentID: documentId,
        confirmationIN: {
          confirmationType:
            reviewApproval === ReviewApprovalEnum.APPROVED ? 1 : 2,
          confirmationParty: isRepresentativeOfCompanyOrInstitue ? 1 : 2,
          objection: reviewComment as string,
        },
      })
    } catch (e) {
      this.logger.error('Error reviewing application to SÍ', { e })
      throw new Error('Villa kom upp við samþykki á umsókn.')
    }
  }
}
