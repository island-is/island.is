import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany, isValid } from 'kennitala'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  CatalogItem,
  Charge,
} from '@island.is/clients/charge-fjs-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'

import { PaymentFlow, PaymentFlowCharge } from './models/paymentFlow.model'

import { PaymentFlowUpdateEvent, PaymentMethod } from '../../types'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'

import { environment } from '../../environments'
import { PaymentFlowEvent } from './models/paymentFlowEvent.model'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { PaymentFlowFjsChargeConfirmation } from './models/paymentFlowFjsChargeConfirmation.model'

@Injectable()
export class PaymentFlowService {
  constructor(
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @InjectModel(PaymentFlowCharge)
    private readonly paymentFlowChargeModel: typeof PaymentFlowCharge,
    @InjectModel(PaymentFlowEvent)
    private readonly paymentFlowEventModel: typeof PaymentFlowEvent,
    @InjectModel(PaymentFlowFjsChargeConfirmation)
    private readonly paymentFlowFjsChargeConfirmationModel: typeof PaymentFlowFjsChargeConfirmation,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    private nationalRegistryV3: NationalRegistryV3ClientService,
    private companyRegistryApi: CompanyRegistryClientService,
  ) {}

  async createPaymentUrl(
    paymentInfo: CreatePaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    try {
      const paymentFlow = await this.paymentFlowModel.create({
        ...paymentInfo,
        charges: [],
      })

      const charges = paymentInfo.charges.map((charge) => ({
        ...charge,
        paymentFlowId: paymentFlow.id,
      }))

      await this.paymentFlowChargeModel.bulkCreate(charges)

      return {
        urls: {
          is: `${environment.paymentsWeb.origin}/is/${paymentFlow.id}`,
          en: `${environment.paymentsWeb.origin}/en/${paymentFlow.id}`,
        },
      }
    } catch (e) {
      this.logger.error('Failed to create payment url', e)
      throw new Error('Failed to create payment url')
    }
  }

  private async getPaymentFlowChargeDetails(
    organisationId: string,
    charges: PaymentFlowCharge[],
  ) {
    const { item } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
        organisationId,
      )

    const filteredChargeInformation: CatalogItem[] = []

    for (const product of item) {
      const matchingCharge = charges.find(
        (c) => c.chargeItemCode === product.chargeItemCode,
      )

      if (!matchingCharge) {
        continue
      }

      const price = matchingCharge.price ?? product.priceAmount

      filteredChargeInformation.push({
        ...product,
        priceAmount: price * matchingCharge.quantity,
      })
    }

    return {
      firstProductTitle: filteredChargeInformation?.[0]?.chargeItemName ?? null,
      totalPrice: filteredChargeInformation.reduce(
        (acc, charge) => acc + charge.priceAmount,
        0,
      ),
      catalogItems: filteredChargeInformation,
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

  async getPaymentFlowWithPaymentDetails(id: string) {
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: PaymentFlowCharge,
          },
        ],
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException('Payment flow not found')
    }

    const paymentFlowSuccessEvent = (
      await this.paymentFlowEventModel.findOne({
        where: {
          paymentFlowId: id,
          type: 'success',
        },
      })
    )?.toJSON()

    if (paymentFlowSuccessEvent) {
      throw new BadRequestException('already_paid')
    }

    const paymentDetails = await this.getPaymentFlowChargeDetails(
      paymentFlow.organisationId,
      paymentFlow.charges,
    )

    return {
      paymentFlow,
      paymentDetails,
    }
  }

  async getPaymentFlow(id: string): Promise<GetPaymentFlowDTO | null> {
    try {
      const { paymentFlow, paymentDetails } =
        await this.getPaymentFlowWithPaymentDetails(id)

      const payerName = await this.getPayerName(paymentFlow.payerNationalId)

      return {
        ...paymentFlow,
        productTitle:
          paymentFlow.productTitle ?? paymentDetails.firstProductTitle,
        productPrice: paymentDetails.totalPrice,
        payerName,
        availablePaymentMethods:
          paymentFlow.availablePaymentMethods as PaymentMethod[],
      }
    } catch (e) {
      this.logger.error('Failed to get payment flow', e)
      throw e
    }
  }

  async logPaymentFlowUpdate(update: {
    paymentFlowId: string
    type: PaymentFlowEvent['type']
    occurredAt: Date
    paymentMethod: PaymentMethod
    reason: PaymentFlowEvent['reason']
    message: string
    metadata?: object
  }) {
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id: update.paymentFlowId,
        },
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new Error('Payment flow not found')
    }

    try {
      this.logger.info(
        `Payment flow update [${update.paymentFlowId}][${update.type}]`,
      )
      await this.paymentFlowEventModel.create(update)
    } catch (e) {
      this.logger.error('Failed to log payment flow update', e)
    }

    try {
      const updateBody: PaymentFlowUpdateEvent = {
        type: update.type,
        paymentFlowId: update.paymentFlowId,
        paymentFlowMetadata: paymentFlow.metadata,
        occurredAt: update.occurredAt,
        details: {
          paymentMethod: update.paymentMethod,
          reason: update.reason,
          message: update.message,
          eventMetadata: update.metadata,
        },
      }

      await fetch(paymentFlow.onUpdateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      })
    } catch (e) {
      this.logger.error('Failed to notify onUpdateUrl', e)
    }
  }

  async createPaymentCharge(paymentFlowId: string, chargePayload: Charge) {
    const chargeConfirmation = await this.chargeFjsV2ClientService.createCharge(
      chargePayload,
    )

    const newChargeConfirmation =
      await this.paymentFlowFjsChargeConfirmationModel.create({
        paymentFlowId,
        receptionId: chargeConfirmation.receptionID,
        user4: chargeConfirmation.user4,
      })

    return newChargeConfirmation
  }

  async deletePaymentFlow(id: string) {
    // TODO
  }
}
