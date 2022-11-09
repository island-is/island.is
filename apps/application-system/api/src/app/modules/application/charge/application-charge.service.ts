import { Inject, Injectable } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { PaymentService } from '../../payment/payment.service'
import { ExternalData } from '@island.is/application/types'

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
    try {
      const payment = await this.paymentService.findPaymentByApplicationId(
        application.id,
      )

      // No need to delete charge if already paid or never existed
      if (!payment || payment.fulfilled) {
        return
      }

      // Delete the charge, using the ID we got from FJS
      const chargeId = this.getChargeId(application)
      if (chargeId) {
        await this.chargeFjsV2ClientService.deleteCharge(chargeId)
      }
    } catch (error) {
      this.logger.error(
        `Application charge delete error on id ${application.id}`,
        error,
      )

      throw error
    }
  }

  async revertCharge(application: Pick<Application, 'id' | 'externalData'>) {
    try {
      const payment = await this.paymentService.findPaymentByApplicationId(
        application.id,
      )

      // No need to revert charge if not yet paid or never existed
      if (!payment || !payment.fulfilled) {
        return
      }

      // Revert the charge, using the ID we got from FJS
      const chargeId = this.getChargeId(application)
      if (chargeId) {
        await this.chargeFjsV2ClientService.revertCharge(chargeId)
      }
    } catch (error) {
      this.logger.error(
        `Application charge revert error on id ${application.id}`,
        error,
      )

      throw error
    }
  }

  getChargeId(application: Pick<Application, 'externalData'>) {
    const externalData = application.externalData as
      | ExternalData
      | undefined
      | null
    if (!externalData?.createCharge?.data) {
      return
    }

    const { id: chargeId } = externalData.createCharge.data as {
      id: string
    }

    return chargeId
  }
}
