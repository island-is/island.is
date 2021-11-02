import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import {
  HealthInsuranceAccidentNotificationAttachmentTypes,
  HealthInsuranceAccidentNotificationConfirmationTypes,
  HealthInsuranceAccidentNotificationStatusTypes,
} from './types'
import {
  AccidentNotificationAttachment,
  AccidentNotificationConfirmation,
  AccidentNotificationStatus,
} from './graphql/models'

const mapStatus = (statusId: number) => {
  switch (statusId) {
    case 0:
      return HealthInsuranceAccidentNotificationStatusTypes.ACCEPTED
    case 1:
      return HealthInsuranceAccidentNotificationStatusTypes.REFUSED
    case 2:
      return HealthInsuranceAccidentNotificationStatusTypes.INPROGRESS
    case 3:
      return HealthInsuranceAccidentNotificationStatusTypes.INPROGRESSWAITINGFORDOCUMENT
    default:
      break
  }
}

const mapAttachmentType = (attachmentTypeId: number) => {
  switch (attachmentTypeId) {
    case 1:
      return HealthInsuranceAccidentNotificationAttachmentTypes.INJURY_CERTIFICATE
    case 2:
      return HealthInsuranceAccidentNotificationAttachmentTypes.PROXY_DOCUMENT
    case 3:
      return HealthInsuranceAccidentNotificationAttachmentTypes.POLICE_REPORT
    default:
      break
  }
}

const mapConfirmationType = (confirmationTypeId: number) => {
  switch (confirmationTypeId) {
    case 1:
      return HealthInsuranceAccidentNotificationConfirmationTypes.INJUREDORREPRESENTATIVEPARTY
    case 2:
      return HealthInsuranceAccidentNotificationConfirmationTypes.COMPANYPARTY
    default:
      break
  }
}

@Injectable()
export class AccidentNotificationService {
  constructor(
    private readonly accidentNotificationApi: DocumentApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getAccidentNotificationStatus(
    ihiDocumentID: number,
  ): Promise<AccidentNotificationStatus | null> {
    this.logger.log('starting call to get accident', ihiDocumentID)
    const accidentStatus = await this.accidentNotificationApi.documentGetAccidentStatus(
      { ihiDocumentID: ihiDocumentID },
    )
    if (!accidentStatus) return null
    return {
      numberIHI: accidentStatus.numberIHI,
      status: accidentStatus.status ? mapStatus(accidentStatus.status) : '',
      attachments: accidentStatus.attachments?.map((attachment) => {
        return {
          isReceived: !!attachment.isReceived,
          attachmentType: attachment.attachmentType
            ? mapAttachmentType(attachment.attachmentType)
            : '',
        } as AccidentNotificationAttachment
      }),
      confirmations: accidentStatus.confirmations?.map((attachment) => {
        return {
          isReceived: !!attachment.isReceived,
          confirmationType: attachment.confirmationType
            ? mapConfirmationType(attachment.confirmationType)
            : '',
        } as AccidentNotificationConfirmation
      }),
    } as AccidentNotificationStatus
  }
}
