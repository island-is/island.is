import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlow } from './models/paymentFlow.model'

import { PaymentInformation, PaymentMethod } from '../../types'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'

@Injectable()
export class PaymentFlowService {
  constructor(
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
  ) {}

  async createPaymentUrl(
    paymentInfo: Omit<PaymentInformation, 'id'>,
  ): Promise<{ url: string }> {
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

  private async getPaymentFlowCharges(
    organisationId: string,
    productIds: string[],
  ) {
    const { item } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
        organisationId,
      )

    const charges = item.filter(
      (product) =>
        productIds.includes(product.chargeItemCode) &&
        product.performingOrgID === organisationId,
    )

    return {
      charges,
      firstProductTitle: charges?.[0]?.chargeItemName ?? null,
      totalPrice: charges.reduce((acc, charge) => acc + charge.priceAmount, 0),
    }
  }

  async getPaymentInfo(id: string): Promise<GetPaymentFlowDTO | null> {
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

      const paymentDetails = await this.getPaymentFlowCharges(
        result.organisationId,
        result.productIds,
      )

      return {
        ...result,
        productTitle: result.productTitle ?? paymentDetails.firstProductTitle,
        productPrice: paymentDetails.totalPrice,
        availablePaymentMethods:
          result.availablePaymentMethods as PaymentMethod[],
      }
    } catch (e) {
      this.logger.error('Failed to get payment flow', e)
      return null
    }
  }
}
