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

import {
  PaymentFlow,
  PaymentFlowAttributes,
  PaymentFlowCharge,
} from './models/paymentFlow.model'

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
import { FjsErrorCode, PaymentServiceCode } from '@island.is/shared/constants'
import { CatalogItemWithQuantity } from '../../types/charges'
import {
  fjsErrorMessageToCode,
  generateChargeFJSPayload,
  mapFjsErrorToCode,
} from '../../utils/fjsCharge'
import { PaymentFlowPaymentConfirmation } from './models/paymentFlowPaymentConfirmation.model'
import { ChargeResponse } from '../cardPayment/cardPayment.types'
import { retry } from '@island.is/shared/utils/server'
import { PaymentTrackingData } from '../../types/cardPayment'

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
    @InjectModel(PaymentFlowPaymentConfirmation)
    private readonly paymentFlowConfirmationModel: typeof PaymentFlowPaymentConfirmation,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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
            extraData: paymentInfo.extraData,
            chargeItemSubjectId: paymentInfo.chargeItemSubjectId,
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
      this.logger.error('Failed to create payment url', e)

      const fjsCode = mapFjsErrorToCode(e, true)

      if (fjsCode !== null) {
        throw new BadRequestException(fjsCode)
      }

      // TODO: Map error codes to PaymentServiceCode
      throw new BadRequestException(
        PaymentServiceCode.CouldNotCreatePaymentFlow,
      )
    }
  }

  async getPaymentFlowChargeDetails(
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

  async getPaymentFlowDetails(id: string) {
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

    return paymentFlow
  }

  async getPaymentFlowStatus(paymentFlow: PaymentFlowAttributes) {
    const paymentFlowSuccessEvent = (
      await this.paymentFlowEventModel.findOne({
        where: {
          paymentFlowId: paymentFlow.id,
          type: 'success',
        },
      })
    )?.toJSON()

    const isAlreadyPaid = !!paymentFlowSuccessEvent

    let paymentStatus: PaymentStatus = isAlreadyPaid
      ? PaymentStatus.PAID
      : PaymentStatus.UNPAID
    let updatedAt = paymentFlowSuccessEvent?.modified ?? paymentFlow.modified

    if (!isAlreadyPaid) {
      const chargeConfirmation = (
        await this.paymentFlowFjsChargeConfirmationModel.findOne({
          where: {
            paymentFlowId: paymentFlow.id,
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

    return { paymentStatus, updatedAt }
  }

  async getPaymentFlow(id: string): Promise<GetPaymentFlowDTO | null> {
    try {
      const paymentFlow = await this.getPaymentFlowDetails(id)
      const paymentDetails = await this.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges,
      )
      const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
        paymentFlow,
      )

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
      this.logger.error(`Failed to get payment flow (${id})`, e)
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
    this.logger.info(
      `Payment flow update [${update.paymentFlowId}][${update.type}][${update.message}]`,
    )
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
      await this.paymentFlowEventModel.create(update)
    } catch (e) {
      this.logger.error(
        `[${update.paymentFlowId}] Failed to log payment flow update event to database`,
        { error: e },
      )
      // Depending on requirements, we might not want to stop the onUpdateUrl notification if DB log fails
      // For now, it continues.
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

      await retry(
        async () => {
          const response = await fetch(paymentFlow.onUpdateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Ensure updateBody is not null when used here, though it should always be set.
            body: JSON.stringify(updateBody!),
          })
          if (!response.ok) {
            const errorBody = await response
              .text()
              .catch(() => 'Could not read error body')
            this.logger.warn(
              `[${update.paymentFlowId}] Failed to notify onUpdateUrl (attempt): ${response.status} ${response.statusText}`,
              {
                url: paymentFlow.onUpdateUrl,
                responseBody: errorBody,
              },
            )
            throw new Error(
              `Failed to notify onUpdateUrl: ${response.status} ${response.statusText}, body: ${errorBody}`,
            )
          }
          this.logger.info(
            `[${update.paymentFlowId}] Successfully notified onUpdateUrl`,
            {
              url: paymentFlow.onUpdateUrl,
              type: update.type,
              reason: update.reason,
            },
          )
        },
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          logger: this.logger,
          logPrefix: `[${update.paymentFlowId}] Notify onUpdateUrl for flow event type ${update.type}`,
          shouldRetryOnError: (error) => {
            return true
          },
        },
      )
    } catch (e) {
      this.logger.error(
        `[${update.paymentFlowId}] Failed to notify onUpdateUrl after all retries`,
        {
          error: e.message,
          onUpdateUrl: paymentFlow.onUpdateUrl,
        },
      )
    }
  }

  async createPaymentConfirmation({
    paymentResult,
    paymentFlowId,
    totalPrice,
    paymentTrackingData,
  }: {
    paymentResult: ChargeResponse
    paymentFlowId: string
    totalPrice: number
    paymentTrackingData: PaymentTrackingData
  }) {
    try {
      return await retry(
        () =>
          this.paymentFlowConfirmationModel.create({
            id: paymentTrackingData.correlationId,
            acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
            authorizationCode: paymentResult.authorizationCode,
            cardScheme: paymentResult.cardInformation.cardScheme,
            maskedCardNumber: paymentResult.maskedCardNumber,
            paymentFlowId,
            cardUsage: paymentResult.cardInformation.cardUsage,
            totalPrice,
            merchantReferenceData: paymentTrackingData.merchantReferenceData,
          }),
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          shouldRetryOnError: (error) => {
            const code = mapFjsErrorToCode(error, true)

            if (code === FjsErrorCode.AlreadyCreatedCharge) {
              return false
            }

            return true
          },
          logger: this.logger,
          logPrefix: 'Failed to persist payment confirmation',
        },
      )
    } catch {
      this.logger.error(
        `Failed to create payment confirmation (${paymentFlowId})`,
      )

      throw new BadRequestException(
        PaymentServiceCode.CouldNotCreatePaymentConfirmation,
      )
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
      this.logger.error(`Failed to create payment charge (${paymentFlowId})`, e)

      throw new BadRequestException(mapFjsErrorToCode(e))
    }
  }

  async deletePaymentFlow(id: string) {
    // TODO
  }
}
