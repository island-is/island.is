import { Inject, Injectable } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  ApplicationTypes,
  InstitutionNationalIds,
} from '@island.is/application/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class DrivingLicenseDuplicateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE_DUPLICATE)
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const chargeItemCode = getValueViaPath<string>(answers, 'chargeItemCode')

    if (!chargeItemCode) {
      this.logger.error(
        'chargeItemCode missing somehow in application answers',
        id,
      )
      throw new Error('chargeItemCode missing in answers')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [chargeItemCode],
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      this.logger.warn('paymentUrl missing in response', id)
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
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    await this.drivingLicenseService
      .drivingLicenseDuplicateSubmission({
        districtId: parseInt(answers.district.toString(), 10),
        token: auth.authorization,
        // Always true since submission doesn't happen before
        // user checks the required field which states
        // that the license is lost or stolen
        stolenOrLost: true,
      })
      .catch((e) => {
        this.logger.error('Error submitting application', {
          application: application.id,
          error: e,
        })
        throw Error('Error submitting application to Samgöngustofa')
      })
    return {
      success: true,
    }
  }
}
