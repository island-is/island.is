import { Inject, Injectable } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

@Injectable()
export class DrivingLicenseDuplicateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE_DUPLICATE)
  }

  async canGetNewDuplicate({ auth }: TemplateApiModuleActionProps) {
    const can = await this.drivingLicenseService.canGetNewDuplicate(
      auth.authorization,
    )
    if (!can.canGetNewDuplicate) {
      let summary =
        coreErrorMessages.drivingLicenseDuplicateEntryValidationSign400Error
      if (can.meta) {
        summary =
          coreErrorMessages.drivingLicenseDuplicateEntryValidationExpiredCategoryLicenseError
      }
      throw new TemplateApiError(
        {
          title:
            coreErrorMessages.drivingLicenseDuplicateEntryValidationErrorTitle,
          description: '',
          summary: {
            ...summary,
            values: {
              categoryName: can.meta,
            },
          },
          defaultMessage: '',
        },
        400,
      )
    }
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
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    const pickUpLicense =
      getValueViaPath(answers, 'delivery.deliveryMethod') === 'pickup'

    const districtId =
      getValueViaPath<string>(answers, 'delivery.district') ?? ''

    // Get the selected photo option
    const selectedPhoto =
      getValueViaPath<string>(answers, 'selectLicensePhoto') ?? ''

    // If selected photo is qualityPhoto (frá ökuskírteini) or empty, set to null
    // Otherwise, use the biometricId from national registry photo
    const imageBiometricsId =
      !selectedPhoto ||
      selectedPhoto === 'qualityPhoto' ||
      selectedPhoto === 'fakePhoto'
        ? null
        : selectedPhoto

    await this.drivingLicenseService
      .drivingLicenseDuplicateSubmission({
        pickUpLicense: Boolean(pickUpLicense),
        districtId: pickUpLicense ? parseInt(districtId) : 37,
        token: auth.authorization,
        stolenOrLost: true,
        imageBiometricsId: imageBiometricsId,
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
