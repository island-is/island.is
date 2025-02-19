import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
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
import { AccidentreportsApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

const mapStatus = (statusId: number) => {
  switch (statusId) {
    case 1:
      return StatusTypes.INPROGRESS
    case 2:
      return StatusTypes.INPROGRESSWAITINGFORDOCUMENT
    case 3:
      return StatusTypes.ACCEPTED
    case 4:
      return StatusTypes.REFUSED
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
    private readonly accidentReportsApi: AccidentreportsApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private accidentsReportsApiWithAuth(auth: Auth) {
    return this.accidentReportsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getAccidentNotificationStatus(
    auth: Auth,
    ihiDocumentID: number,
  ): Promise<AccidentNotificationStatus | null> {
    this.logger.debug('starting call to get accident', ihiDocumentID)

    const accidentStatus = await this.accidentsReportsApiWithAuth(
      auth,
    ).getAccidentReportStatus({
      reportId: ihiDocumentID,
    })

    if (!accidentStatus) return null
    return {
      numberIHI: accidentStatus.requestId,
      status: accidentStatus.status ? mapStatus(accidentStatus.status) : '',
      receivedAttachments: accidentStatus.attachments
        ?.map((x) => ({
          [mapAttachmentType(x.type)]: !!x.received,
        }))
        .reduce(
          (prev, curr) => ({ ...prev, ...curr }),
          {},
        ) as AccidentNotificationAttachment,
      receivedConfirmations: accidentStatus.confirmations
        ?.map((x) => ({
          [mapConfirmationType(x.party)]: !!x.received,
        }))
        .reduce(
          (prev, curr) => ({ ...prev, ...curr }),
          {},
        ) as AccidentNotificationConfirmation,
    } as AccidentNotificationStatus
  }
}
