import { Inject, Injectable } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { PaymentService } from '@island.is/application/api/payment'

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

  async deleteCharge(
    application: Pick<Application, 'id' | 'typeId' | 'state'>,
  ) {
    try {
      const payment = await this.paymentService.findPaymentByApplicationId(
        application.id,
      )

      // No need to delete charge if never existed
      if (!payment) {
        return
      }

      // No need to delete charge if already paid (and should not be refunded)
      if (payment.fulfilled) {
        const template = await getApplicationTemplateByTypeId(
          application.typeId,
        )

        const stateConfig =
          template.stateMachineConfig.states[application.state]

        if (
          !stateConfig.meta?.lifecycle?.shouldDeleteChargeIfPaymentFulfilled
        ) {
          return
        }
      }

      // Delete the charge, using the ID we got from FJS
      const paymentUrl = (payment.definition as { paymentUrl: string })
        ?.paymentUrl as string

      const url = new URL(paymentUrl)
      const chargeId = url.pathname.split('/').pop()

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
}
