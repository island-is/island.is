import { Inject, Injectable } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  getChargeId,
} from '@island.is/clients/charge-fjs-v2'
import { PaymentService } from '../../payment/payment.service'

@Injectable()
export class ApplicationChargeService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private paymentService: PaymentService,
  ) {
    this.logger = logger.child({ context: 'ApplicationChargeService' })
  }

  async deleteCharge(application: Pick<Application, 'id' | 'externalData'>) {
    const payment = await this.paymentService.findPaymentByApplicationId(
      application.id,
    )

    // No need to delete charge if never existed
    if (!payment) {
      return
    }

    // No need to delete charge if already paid
    if (payment.fulfilled) {
      return
    }

    // Fetch the ID we got from FJS, and make sure it exists
    const chargeId = getChargeId(application)
    if (!chargeId) {
      return
    }

    // Delete the charge
    try {
      await this.chargeFjsV2ClientService.deleteCharge(chargeId)
    } catch (error) {
      this.logger.error(
        `Application charge delete error on application id ${application.id} and charge id ${chargeId}`,
        error,
      )

      throw error
    }
  }

  async revertCharge(application: Pick<Application, 'id' | 'externalData'>) {
    const payment = await this.paymentService.findPaymentByApplicationId(
      application.id,
    )

    // No need to revert charge if never existed
    if (!payment) {
      return
    }

    // No need to revert charge if not yet paid
    if (!payment.fulfilled) {
      return
    }

    // Fetch the ID we got from FJS, and make sure it exists
    const chargeId = getChargeId(application)
    if (!chargeId) {
      return
    }

    // Revert the charge
    try {
      await this.chargeFjsV2ClientService.revertCharge(chargeId)
    } catch (error) {
      this.logger.error(
        `Application charge revert error on application id ${application.id} and charge id ${chargeId}`,
        error,
      )

      throw error
    }
  }
}
