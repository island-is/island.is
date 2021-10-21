import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import {
  AccidentNotificationStatus,
  StatusTypes,
} from './models/accidentNotificationStatus.model'
import {
  AccidentNotificationAttachment,
  AttachmentTypes,
} from './models/accidentNotificationAttachment.model'
import {
  AccidentNotificationConfirmation,
  ConfirmationTypes,
} from './models/accidentNotificationConfirmation.model'

const mapStatus = (statusId: number) => {
  switch (statusId) {
    case 0:
      return StatusTypes.ACCEPTED
    case 1:
      return StatusTypes.REFUSED
    case 2:
      return StatusTypes.INPROGRESS
    case 3:
      return StatusTypes.INPROGRESSWAITINGFORDOCUMENT
    default:
      break
  }
}

const mapAttachmentType = (attachmentTypeId: number) => {
  switch (attachmentTypeId) {
    case 1:
      return AttachmentTypes.INJURY_CERTIFICATE
    case 2:
      return AttachmentTypes.PROXY_DOCUMENT
    case 3:
      return AttachmentTypes.POLICE_REPORT
    default:
      break
  }
}

const mapConfirmationType = (confirmationTypeId: number) => {
  switch (confirmationTypeId) {
    case 1:
      return ConfirmationTypes.INJUREDORREPRESENTATIVEPARTY
    case 2:
      return ConfirmationTypes.COMPANYPARTY
    default:
      break
  }
}

@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly accidentNotificationApi: DocumentApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getAccidentNotificationStatus(
    ihiDocumentID: number,
  ): Promise<AccidentNotificationStatus | null> {
    console.log('starting call to get accident', ihiDocumentID)
    const accidentStatus = await this.accidentNotificationApi.getAccidentStatus(
      { ihiDocumentID: ihiDocumentID },
    )
    console.log('managed to fetch')
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
