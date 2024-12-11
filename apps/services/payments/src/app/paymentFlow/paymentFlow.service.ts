import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany, isValid } from 'kennitala'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlow } from './models/paymentFlow.model'

import { PaymentInformation, PaymentMethod } from '../../types'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'

@Injectable()
export class PaymentFlowService {
  constructor(
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private nationalRegistryV3: NationalRegistryV3ClientService,
    private companyRegistryApi: CompanyRegistryClientService,
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

  private async getPayerName(payerNationalId: string) {
    if (!isValid(payerNationalId)) {
      throw new Error('Invalid payer national id')
    }

    if (isCompany(payerNationalId)) {
      const company = await this.companyRegistryApi.getCompany(payerNationalId)

      if (!company) {
        throw new Error('Company not found')
      }

      return company.name
    }

    const person = await this.nationalRegistryV3.getAllDataIndividual(
      payerNationalId,
    )

    if (!person) {
      throw new Error('Person not found')
    }

    return person.nafn ?? ''
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

      const payerName = await this.getPayerName(result.payerNationalId)

      return {
        ...result,
        productTitle: result.productTitle ?? paymentDetails.firstProductTitle,
        productPrice: paymentDetails.totalPrice,
        payerName,
        availablePaymentMethods:
          result.availablePaymentMethods as PaymentMethod[],
      }
    } catch (e) {
      this.logger.error('Failed to get payment flow', e)
      return null
    }
  }
}
