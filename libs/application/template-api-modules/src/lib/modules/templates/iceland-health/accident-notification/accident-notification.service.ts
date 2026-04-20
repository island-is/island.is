import {
  AccidentNotificationAnswers,
  ReviewApprovalEnum,
  utils,
} from '@island.is/application/templates/iceland-health/accident-notification'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { SharedTemplateApiService } from '../../../shared'
import { whiteListedErrorCodes } from './accident-notification.utils'
import type { AccidentNotificationConfig } from './config'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import {
  generateAssignReviewerEmail,
  generateConfirmationEmail,
} from './emailGenerators'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import {
  attachmentStatusToAttachmentRequests,
  getAddAttachmentSentDocumentHashList,
  getNewAttachments,
  getReportId,
  getReviewApplicationData,
} from './attachments/attachment.utils'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  applicationToAccidentReport,
  mapAttachmentTypeToAccidentReportType,
} from './accident-notification-v2.utils'
import { AccidentreportsApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60

@Injectable()
export class AccidentNotificationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(ACCIDENT_NOTIFICATION_CONFIG)
    private accidentConfig: AccidentNotificationConfig,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentProvider: AccidentNotificationAttachmentProvider,
    private readonly accidentReportsApi: AccidentreportsApi,
  ) {
    super(ApplicationTypes.ACCIDENT_NOTIFICATION)
  }

  private accidentsReportsApiWithAuth(auth: Auth) {
    return this.accidentReportsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const requests = attachmentStatusToAttachmentRequests()
      const attachments = await this.attachmentProvider.getFiles(
        requests,
        application,
      )

      const fileHashList = attachments.map((attachment) => attachment.hash)
      const answers = application.answers as AccidentNotificationAnswers
      const accidentReport = applicationToAccidentReport(answers, attachments)

      const res = await this.accidentsReportsApiWithAuth(
        auth,
      ).submitAccidentReport({
        minarsidurAPIModelsAccidentReportsAccidentReportDTO: accidentReport,
      })
      const reportId = res.reportId

      await this.sharedTemplateAPIService.sendEmail(
        (props) =>
          generateConfirmationEmail(
            props,
            this.accidentConfig.applicationSenderName,
            this.accidentConfig.applicationSenderEmail,
            reportId ?? undefined,
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
            generateAssignReviewerEmail(
              props,
              assignLink,
              reportId ?? undefined,
            ),
          application,
          token,
        )
      }
      return {
        documentId: reportId,
        sentDocuments: fileHashList,
      }
    } catch (e) {
      // In the case we get a precondition error we present it to the user
      if (e.body && e.body.errorList && e.body.errorList.length > 0) {
        throw new Error(
          `Villa kom upp við vistun á umsókn. ${e.body.errorList
            .map((error: { errorType?: string; errorDesc?: string }) => {
              if (
                error.errorType &&
                error.errorDesc &&
                whiteListedErrorCodes.includes(error.errorType)
              ) {
                return error.errorDesc
              }
            })
            .join('\n')}`,
        )
      }
      this.logger.error('Error submitting accident notification application', e)
      throw new Error('Villa kom upp við vistun á umsókn.')
    }
  }

  async addAdditionalAttachment({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const reportId = getReportId(application)

    if (!reportId) {
      throw new Error(
        'Villa kom upp við vistun á umsókn. Skjalanúmer fannst ekki.',
      )
    }

    const newAttachments = await getNewAttachments(
      application,
      this.attachmentProvider,
    )

    let successfulAttachments = []

    try {
      const promises = newAttachments.map((attachment) => {
        const attachmentType = mapAttachmentTypeToAccidentReportType(
          attachment.attachmentType,
        )
        const contentType = attachment.name.split('.').pop()
        return this.accidentsReportsApiWithAuth(
          auth,
        ).submitAccidentReportAttachment({
          reportId,
          minarsidurAPIModelsAccidentReportsAccidentReportAttachmentDTO: {
            type: attachmentType,
            document: {
              fileName: attachment.name,
              contentType,
              data: attachment.content,
            },
          },
        })
      })

      successfulAttachments = (await Promise.all(promises)).filter(
        (x) => x !== null,
      )
    } catch (e) {
      this.logger.error('Error adding additional attachment', e)
      throw new Error('Villa kom upp við að bæta við viðbótarskjali.')
    }

    return {
      sentDocuments: [
        ...getAddAttachmentSentDocumentHashList(application),
        ...successfulAttachments.map((attachment) => attachment.requestId),
      ],
    }
  }

  async reviewApplication({ application, auth }: TemplateApiModuleActionProps) {
    const {
      documentId,
      isRepresentativeOfCompanyOrInstitute,
      reviewApproval,
      reviewComment,
    } = getReviewApplicationData(application)

    await this.accidentsReportsApiWithAuth(
      auth,
    ).submitAccidentReportConfirmation({
      reportId: documentId,
      minarsidurAPIModelsAccidentReportsAccidentReportConfirmationDTO: {
        party: isRepresentativeOfCompanyOrInstitute ? 1 : 2,
        accepted: reviewApproval === ReviewApprovalEnum.APPROVED,
        comment: reviewComment,
      },
    })
  }
}
