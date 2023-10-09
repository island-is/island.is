import { getValueViaPath } from '@island.is/application/core'
import {
  AccidentNotificationAnswers,
  ReviewApprovalEnum,
  utils,
} from '@island.is/application/templates/accident-notification'
import { DocumentApi } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  applictionAnswersToXml,
  getApplicationDocumentId,
  whiteListedErrorCodes,
} from './accident-notification.utils'
import type { AccidentNotificationConfig } from './config'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import {
  attachmentStatusToAttachmentRequests,
  filterOutAlreadySentDocuments,
  getAddAttachmentSentDocumentHashList,
  getApplicationAttachmentStatus,
} from './attachments/attachment.utils'
import { AccidentNotificationAttachment } from './types/attachments'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class AccidentNotificationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(ACCIDENT_NOTIFICATION_CONFIG)
    private accidentConfig: AccidentNotificationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentProvider: AccidentNotificationAttachmentProvider,
    private readonly documentApi: DocumentApi,
  ) {
    super(ApplicationTypes.ACCIDENT_NOTIFICATION)
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      const requests = attachmentStatusToAttachmentRequests()

      const attachments = await this.attachmentProvider.getFiles(
        requests,
        application,
      )

      const fileHashList = attachments.map((attachment) => attachment.hash)

      const answers = application.answers as AccidentNotificationAnswers
      const xml = applictionAnswersToXml(answers, attachments)

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
      if (utils.shouldRequestReview(answers)) {
        const token = await this.sharedTemplateAPIService.createAssignToken(
          application,
          SIX_MONTHS_IN_SECONDS_EXPIRES,
        )

        await this.sharedTemplateAPIService.assignApplicationThroughEmail(
          (props, assignLink) =>
            generateAssignReviewerEmail(props, assignLink, ihiDocumentID),
          application,
          token,
        )
      }
      return {
        documentId: ihiDocumentID,
        sentDocuments: fileHashList,
      }
    } catch (e) {
      // In the case we get a precondition error we present it to the user
      if (e.body && e.body.errorList && e.body.errorList.length > 0) {
        throw new Error(
          `Villa kom upp við vistun á umsókn. ${e.body.errorList
            .map((e: any) => {
              if (
                e.errorType &&
                e.errorDesc &&
                whiteListedErrorCodes.includes(e.errorType)
              ) {
                return e.errorDesc
              }
            })
            .join('\n')}`,
        )
      }
      throw new Error('Villa kom upp við vistun á umsókn.')
    }
  }

  async addAdditionalAttachment({ application }: TemplateApiModuleActionProps) {
    const attachmentStatus = getApplicationAttachmentStatus(application)
    const requests = attachmentStatusToAttachmentRequests(attachmentStatus)

    const attachments = await this.attachmentProvider.getFiles(
      requests,
      application,
    )

    const newAttachments = filterOutAlreadySentDocuments(
      attachments,
      application,
    )

    const documentId = getApplicationDocumentId(application)

    const promises = newAttachments.map((attachment) =>
      this.sendAttachment(attachment, documentId),
    )

    const successfulAttachments = (await Promise.all(promises)).filter(
      (x) => x !== null,
    )

    return {
      sentDocuments: [
        ...getAddAttachmentSentDocumentHashList(application),
        ...successfulAttachments,
      ],
    }
  }

  /**
   * Sends the attachment to SÍ and returns the document hash on success and null on failure
   * @param attachment attachment to send
   */
  private async sendAttachment(
    attachment: AccidentNotificationAttachment,
    documentId: number,
  ): Promise<string | null> {
    try {
      await this.documentApi.documentDocumentAttachment({
        documentAttachment: {
          attachmentBody: attachment.content,
          attachmentType: attachment.attachmentType,
          title: attachment.name,
        },
        ihiDocumentID: documentId,
      })
      return attachment.hash
    } catch (e) {
      this.logger.error('Error sending document to SÍ', e)
      return null
    }
  }

  async reviewApplication({ application }: TemplateApiModuleActionProps) {
    const documentId = getApplicationDocumentId(application)

    const isRepresentativeOfCompanyOrInstitue =
      utils.isRepresentativeOfCompanyOrInstitute(application.answers)
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
  }
}
