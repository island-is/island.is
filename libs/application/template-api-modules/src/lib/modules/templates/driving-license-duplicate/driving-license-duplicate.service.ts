import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseService,
  NewDrivingLicenseResult,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

@Injectable()
export class DrivingLicenseDuplicateService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const chargeItemCode = 'AY116'

    const response = await this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      chargeItemCode,
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
    console.log('submitting')
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    // let result
    // try {
    //   result = await this.createLicense(nationalId, answers)
    // } catch (e) {
    //   this.log('error', 'Creating license failed', {
    //     e,
    //     applicationFor: answers.applicationFor,
    //     jurisdiction: answers.juristictionId,
    //   })

    //   throw e
    // }

    // if (!result.success) {
    //   throw new Error(`Application submission failed (${result.errorMessage})`)
    // }

    // TODO: SUBMIT

    return {
      success: true,
      orderId: '1234',
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[driving-license-submission] ${message}`, meta)
  }
}
