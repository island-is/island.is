import { Inject, Injectable } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { ApplicationTypes } from '@island.is/application/types'

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
