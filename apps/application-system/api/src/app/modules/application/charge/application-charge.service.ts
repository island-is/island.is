import { Inject, Injectable } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { PaymentService } from '../../payment/payment.service'
import { ExternalData } from '@island.is/application/types'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

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
    application: Pick<Application, 'id' | 'externalData' | 'typeId' | 'state'>,
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

        if (!stateConfig.meta?.lifecycle?.shouldDeleteCharge) {
          return
        }
      }

      // Delete the charge, using the ID we got from FJS
      const chargeId = this.getChargeId(application)
      if (chargeId) {
        const status = await this.chargeFjsV2ClientService.getChargeStatus(
          chargeId,
        )

        // Make sure charge has not been deleted yet (will otherwise end in error here and application wont be pruned/deleted)
        if (status !== 'cancelled') {
          await this.chargeFjsV2ClientService.deleteCharge(chargeId)
        }
      }
    } catch (error) {
      this.logger.error(
        `Application charge delete error on id ${application.id}`,
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
