import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Application } from '@island.is/application/api/core'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  PaymentService,
  PaymentMethod,
  PaymentModuleConfig,
} from '@island.is/application/api/payment'
import { PaymentsApi } from '@island.is/clients/payments'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { FetchError } from '@island.is/clients/middlewares'
import { ApplicationStatus } from '@island.is/application/types'
import { getSlugFromType } from '@island.is/application/core'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class ApplicationChargeService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private paymentService: PaymentService,
    private readonly paymentsApi: PaymentsApi,
    @Inject(PaymentModuleConfig.KEY)
    private config: ConfigType<typeof PaymentModuleConfig>,
  ) {
    this.logger = logger.child({ context: 'ApplicationChargeService' })
  }

  async deleteCharge(
    application: Pick<Application, 'id' | 'typeId' | 'state' | 'status'>,
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
        if (application.status === ApplicationStatus.COMPLETED) {
          this.logger.info(
            `Not deleting charge for application ${application.id} because it is completed`,
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
        try {
          await this.paymentsApi.refundControllerRefund({
            refundPaymentInput: {
              paymentFlowId: requestId,
              reasonForRefund: 'Charge deleted',
            },
          })
        } catch (error) {
          let errorMessage = error.message
          if (error instanceof FetchError && error.problem) {
            errorMessage = error.problem?.detail
          }
          if (
            errorMessage ===
            PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded
          ) {
            this.logger.warn(
              `Failed to delete charge for application ${application.id}. Problem: ${errorMessage}. Error was not rethrown.`,
            )
          } else {
            throw error
          }
        }
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

  async getApplicationLink(application: Pick<Application, 'id' | 'typeId'>) {
    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${application.id}`,
      )
    }

    const baseUrl = new URL(this.config.clientLocationOrigin)
    baseUrl.pathname = `umsoknir/${applicationSlug}/${application.id}`
    const baseUrlString = baseUrl.toString()

    return baseUrlString
  }

  async getInvoicePaymentApplicationIds(
    applicationIds: string[],
  ): Promise<Set<string>> {
    if (applicationIds.length === 0) {
      return new Set<string>()
    }
    const payments = await this.paymentService.findPaymentsByApplicationIds(
      applicationIds,
    )

    const invoiceAppIds = new Set<string>()

    for (const payment of payments) {
      if (payment.payment_method === PaymentMethod.INVOICE) {
        invoiceAppIds.add(payment.application_id)
      }
    }

    return invoiceAppIds
  }
}
