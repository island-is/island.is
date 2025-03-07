import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany, isValid } from 'kennitala'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  Charge,
} from '@island.is/clients/charge-fjs-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'

import { PaymentFlow, PaymentFlowCharge } from './models/paymentFlow.model'

import {
  PaymentFlowUpdateEvent,
  PaymentMethod,
  PaymentStatus,
} from '../../types'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'

import { environment } from '../../environments'
import { PaymentFlowEvent } from './models/paymentFlowEvent.model'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { PaymentFlowFjsChargeConfirmation } from './models/paymentFlowFjsChargeConfirmation.model'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { CatalogItemWithQuantity } from '../../types/charges'
import {
  fjsErrorMessageToCode,
  generateChargeFJSPayload,
} from '../../utils/fjsCharge'

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
      const paymentFlowId = uuid()

      const chargeDetails = await this.getPaymentFlowChargeDetails(
        paymentInfo.organisationId,
        paymentInfo.charges,
      )

      await this.chargeFjsV2ClientService.validateCharge(
        generateChargeFJSPayload({
          paymentFlow: {
            id: paymentFlowId,
            organisationId: paymentInfo.organisationId,
            payerNationalId: paymentInfo.payerNationalId,
          },
          charges: chargeDetails.catalogItems,
          totalPrice: chargeDetails.totalPrice,
          systemId: environment.chargeFjs.systemId,
          returnUrl: '', // TODO
        }),
      )

      const paymentFlow = await this.paymentFlowModel.create({
        ...paymentInfo,
        id: paymentFlowId,
        charges: [],
      })

      await this.paymentFlowChargeModel.bulkCreate(
        paymentInfo.charges.map((charge) => ({
          ...charge,
          paymentFlowId,
        })),
      )

      return {
        urls: {
          is: `${environment.paymentsWeb.origin}/is/${paymentFlow.id}`,
          en: `${environment.paymentsWeb.origin}/en/${paymentFlow.id}`,
        },
      }
    } catch (e) {
      // TODO: Map error codes to PaymentServiceCode
      this.logger.error('Failed to create payment url', e)
      throw new BadRequestException(
        PaymentServiceCode.CouldNotCreatePaymentFlow,
      )
    }
  }

  private async getPaymentFlowChargeDetails(
    organisationId: string,
    charges: Pick<PaymentFlowCharge, 'chargeItemCode' | 'price' | 'quantity'>[],
  ) {
    const { item } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
        organisationId,
      )

    const filteredChargeInformation: CatalogItemWithQuantity[] = []

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
        quantity: matchingCharge.quantity,
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
      throw new BadRequestException(PaymentServiceCode.InvalidPayerNationalId)
    }

    if (isCompany(payerNationalId)) {
      const company = await this.companyRegistryApi.getCompany(payerNationalId)

      if (!company) {
        throw new BadRequestException(PaymentServiceCode.CompanyNotFound)
      }

      return company.name
    }

    const person = await this.nationalRegistryV3.getAllDataIndividual(
      payerNationalId,
    )

    if (!person) {
      throw new BadRequestException(PaymentServiceCode.PersonNotFound)
    }

    return person.nafn ?? ''
  }

  async isEligibleToBePaid(id: string) {
    const paymentFlow = (
      await this.paymentFlowModel.findOne({
        where: {
          id,
        },
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
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
      return false
    }

    return true
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
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    const paymentFlowSuccessEvent = (
      await this.paymentFlowEventModel.findOne({
        where: {
          paymentFlowId: id,
          type: 'success',
        },
      })
    )?.toJSON()

    const paymentDetails = await this.getPaymentFlowChargeDetails(
      paymentFlow.organisationId,
      paymentFlow.charges,
    )

    const isAlreadyPaid = !!paymentFlowSuccessEvent

    let paymentStatus: PaymentStatus = isAlreadyPaid
      ? PaymentStatus.PAID
      : PaymentStatus.UNPAID
    let updatedAt = paymentFlowSuccessEvent?.modified ?? paymentFlow.modified

    if (!isAlreadyPaid) {
      const chargeConfirmation = (
        await this.paymentFlowFjsChargeConfirmationModel.findOne({
          where: {
            paymentFlowId: id,
          },
        })
      )?.toJSON()

      if (chargeConfirmation || paymentFlow.existingInvoiceId) {
        paymentStatus = PaymentStatus.INVOICE_PENDING
      }

      if (chargeConfirmation) {
        updatedAt = chargeConfirmation.created
      }
    }

    return {
      paymentFlow,
      paymentDetails,
      paymentStatus,
      updatedAt,
    }
  }

  async getPaymentFlow(id: string): Promise<GetPaymentFlowDTO | null> {
    try {
      const { paymentFlow, paymentDetails, paymentStatus, updatedAt } =
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
        paymentStatus,
        updatedAt,
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
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
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
    try {
      const chargeConfirmation =
        await this.chargeFjsV2ClientService.createCharge(chargePayload)

      const newChargeConfirmation =
        await this.paymentFlowFjsChargeConfirmationModel.create({
          paymentFlowId,
          receptionId: chargeConfirmation.receptionID,
          user4: chargeConfirmation.user4,
        })

      await this.paymentFlowModel.update(
        {
          existingInvoiceId: chargeConfirmation.receptionID,
        },
        {
          where: {
            id: paymentFlowId,
          },
        },
      )

      return newChargeConfirmation
    } catch (e) {
      this.logger.error('Failed to create payment charge', e)

      const message = e?.body?.error?.message ?? e.message ?? 'Unknown error'
      const mappedCode = fjsErrorMessageToCode(message)

      throw new BadRequestException(mappedCode)
    }
  }

  async deletePaymentFlow(id: string) {
    // TODO
  }
}
