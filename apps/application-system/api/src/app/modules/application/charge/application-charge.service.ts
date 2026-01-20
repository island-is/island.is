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
        this.logger.info(
          `Not deleting charge for application ${application.id} because it does not have a payment`,
        )
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
          this.logger.info(
            `Not deleting charge for application ${application.id} because its lifecycle does not allow it`,
          )
          return
        }
      }
      // Delete the charge, using the ID we got from FJS
      const paymentUrl = JSON.parse(payment.definition as unknown as string)
        .paymentUrl as string
      let requestId = payment.request_id as string

      // new mockpayments are getting requestIds and fake urls
      //if requestId is not set, we need to get it from the paymentUrl
      if (!requestId && paymentUrl) {
        const url = new URL(paymentUrl)
        requestId = url.pathname.split('/').pop() ?? ''
        this.logger.info(
          'requestId not set, falling back to getting it from paymentUrl',
        )
      }

      if (requestId) {
        this.logger.info('deleteCharge chargeId', requestId)
        await this.chargeFjsV2ClientService.deleteCharge(requestId)
      } else {
        this.logger.warn('No requestId found, skipping deleteCharge')
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
