import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { getValueViaPath } from '@island.is/application/core'
import {
  PASSPORT_CHARGE_CODES,
  YES,
  NO,
  YesOrNo,
  DiscountCheck,
} from './constants'
import * as kennitala from 'kennitala'

@Injectable()
export class PassportService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const type = getValueViaPath<'regular' | 'express'>(
      answers,
      'type',
      'regular',
    )

    const chargeItemCode =
      type === 'regular'
        ? PASSPORT_CHARGE_CODES.REGULAR
        : PASSPORT_CHARGE_CODES.EXPRESS

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

  async checkForDiscount({ application, auth }: TemplateApiModuleActionProps) {
    const { answers, externalData } = application

    if (!(externalData.checkForDiscount?.data as DiscountCheck)?.hasDiscount) {
      const age = kennitala.info(auth.nationalId).age
      if (age < 18 || age >= 60) {
        return {
          hasDiscount: true,
        }
      }
      const disabilityCheck = getValueViaPath<YesOrNo>(
        answers,
        'personalInfo.hasDisabilityDiscount',
      )

      //TODO: implement check with Tryggingastofnun
      if (disabilityCheck?.includes(YES)) {
        return {
          hasDiscount: true,
        }
      }
    }
  }

  async submitPassportApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string
  }> {
    const { answers } = application

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.logger.error(
        'Trying to submit Passportapplication that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    let result
    try {
      // TODO: Submit to skilrikjaskra
      result = { success: true, errorMessage: null }
    } catch (e) {
      this.log('error', 'Submitting passport failed', {
        e,
        applicationFor: answers.type,
        jurisdiction: answers.dropLocation,
      })

      throw e
    }

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    return {
      success: true,
      orderId: 'PÖNTUN12345',
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[passport] ${message}`, meta)
  }
}
