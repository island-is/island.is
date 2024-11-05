import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PaymentFlow } from './models/paymentFlow.model'

import { PaymentInformation, PaymentMethod } from '../../types'

@Injectable()
export class PaymentFlowService {
  constructor(
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async createPaymentUrl(
    paymentInfo: PaymentInformation,
  ): Promise<{ url: string }> {
    // return { url: 'https://www.island.is/borga/:todoId' }

    try {
      const result = await this.paymentFlowModel.create({
        ...paymentInfo,
      })

      return {
        url: `http://localhost:3333/payments/${result.id}`,
      }
    } catch (e) {
      this.logger.error('Failed to create payment url', e)
      throw new Error('Failed to create payment url')
    }
  }

  async getPaymentInfo(id: string): Promise<PaymentInformation | null> {
    try {
      const result = (
        await this.paymentFlowModel.findOne({
          where: {
            id,
          },
        })
      )?.toJSON()

      if (!result) {
        throw new Error('Payment flow not found')
      }

      return {
        ...result,
        availablePaymentMethods:
          result.availablePaymentMethods as PaymentMethod[],
      }
    } catch (e) {
      this.logger.error('Fail to get payment flow', e)
      return null
    }
    // return {
    //   paymentInfo: {
    //     productId: 'product-id',
    //     availablePaymentMethods: ['card', 'invoice'],
    //     callbacks: {
    //       onSuccessUrl: 'https://www.island.is/borga/success',
    //       onUpdateUrl: 'https://www.island.is/borga/update',
    //       onErrorUrl: 'https://www.island.is/borga/error',
    //     },
    //     organisationId: 'organization-id',
    //     invoiceId: 'todo',
    //   },
    // }
  }
}
