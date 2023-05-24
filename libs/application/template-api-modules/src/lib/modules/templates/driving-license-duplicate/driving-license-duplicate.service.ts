import { Inject, Injectable } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { ApplicationTypes, InstitutionNationalIds } from '@island.is/application/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class DrivingLicenseDuplicateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE_DUPLICATE)
  }

  calculateNeedsHealthCert = (healthDeclaration = {}) => {
    return !!Object.values(healthDeclaration).find((val) => val === 'yes')
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    // TODO: Change to AY116 once its available on dev until then use the regular drivingLicnese code
    const chargeItemCode = 'AY110'

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [chargeItemCode],
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string
  }> {
    const { answers } = application
    const nationalId = application.applicant
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    const orderId = await this.drivingLicenseService.drivingLicenseDuplicateSubmission({
      districtId: parseInt(answers.district.toString(), 10),
      ssn: nationalId,
    }).catch((e) => {
      console.log(JSON.stringify(e, null, 2))
      return {
        success: false,
        orderId: "oof"
      }
    })
    return {
      success: true,
      orderId: `${orderId}`,
    }
  }
}
