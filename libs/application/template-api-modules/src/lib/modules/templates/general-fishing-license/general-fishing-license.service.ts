import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import { GeneralFishingLicenseAnswers } from '@island.is/application/templates/general-fishing-license'
import { getValueViaPath } from '@island.is/application/core'
import { UmsoknirApi } from '@island.is/clients/fishing-license'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class GeneralFishingLicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly umsoknirApi: UmsoknirApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    const answers = application.answers as GeneralFishingLicenseAnswers
    const chargeItemCode = getValueViaPath(
      answers,
      'fishingLicense.chargeType',
    ) as string

    if (!chargeItemCode) {
      this.logger.error('Charge item code missing in General Fishing License.')
      throw new Error('Vörunúmer fyrir FJS vantar.')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      application.id,
      chargeItemCode,
    )

    if (!response?.paymentUrl) {
      this.logger.error(
        'paymentUrl missing in response in General Fishing License.',
      )
      throw new Error('Ekki hefur tekist að búa til slóð fyrir greiðslugátt.')
    }

    return response
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    /* const paymentStatus = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (paymentStatus?.fulfilled !== true) {
      this.logger.error(
        'Trying to submit General Fishing License application that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    } */

    try {
      const applicantNationalId = getValueViaPath(
        application.answers,
        'applicant.nationalId',
      ) as string
      const registrationNumber = getValueViaPath(
        application.answers,
        'shipSelection.registrationNumber',
      ) as string
      const fishingLicense = getValueViaPath(
        application.answers,
        'fishingLicense.license',
      ) as string
      this.umsoknirApi
      await this.umsoknirApi
        .withMiddleware(new AuthMiddleware(auth as Auth))
        .v1UmsoknirPost({
          umsokn: {
            umsaekjandiKennitala: parseInt(applicantNationalId, 10),
            utgerdKennitala: parseInt(applicantNationalId, 10),
            skipaskrarnumer: parseInt(registrationNumber, 10),
            umbedinGildistaka: null,
            veidileyfiKodi: fishingLicense,
          },
        })
      return { success: true }
    } catch (e) {
      this.logger.error(
        'Error submitting General Fishing License application to SÍ',
        e,
      )
      throw new Error('Villa kom upp við skil á umsókn.')
    }
  }
}
