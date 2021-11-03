import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DocumentApi } from '@island.is/clients/health-insurance-v2'
import {
  HealthInsuranceAccidentNotificationAttachmentTypes as AttachmentTypes,
  HealthInsuranceAccidentNotificationConfirmationTypes as ConfirmationTypes,
  HealthInsuranceAccidentNotificationStatusTypes as StatusTypes,
} from './types'
import {
  AccidentNotificationAttachment,
  AccidentNotificationConfirmation,
  AccidentNotificationStatus,
} from './graphql/models'

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

const mapAttachmentType = (attachmentTypeId: number | undefined) => {
  switch (attachmentTypeId) {
    case 1:
      return AttachmentTypes.INJURY_CERTIFICATE
    case 2:
      return AttachmentTypes.PROXY_DOCUMENT
    case 3:
      return AttachmentTypes.POLICE_REPORT
    default:
      return 'Unknown'
  }
}

const mapConfirmationType = (confirmationTypeId: number | undefined) => {
  switch (confirmationTypeId) {
    case 1:
      return ConfirmationTypes.INJUREDORREPRESENTATIVEPARTY
    case 2:
      return ConfirmationTypes.COMPANYPARTY
    default:
      return 'Unknown'
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
    console.log('starting call to get accident', ihiDocumentID)
    const accidentStatus = await this.accidentNotificationApi.documentGetAccidentStatus(
      { ihiDocumentID: ihiDocumentID },
    )
    if (!accidentStatus) return null
    return {
      numberIHI: accidentStatus.numberIHI,
      status: accidentStatus.status ? mapStatus(accidentStatus.status) : '',
      receivedAttachments: accidentStatus.attachments
        ?.map((x) => ({
          [mapAttachmentType(x.attachmentType)]: !!x.isReceived,
        }))
        .reduce(
          (prev, curr) => ({ ...prev, ...curr }),
          {},
        ) as AccidentNotificationAttachment,
      receivedConfirmations: accidentStatus.confirmations
        ?.map((x) => ({
          [mapConfirmationType(x.confirmationType)]: !!x.isReceived,
        }))
        .reduce(
          (prev, curr) => ({ ...prev, ...curr }),
          {},
        ) as AccidentNotificationConfirmation,
    } as AccidentNotificationStatus
  }
}
