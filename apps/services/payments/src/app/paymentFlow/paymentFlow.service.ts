import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ConfigType } from '@nestjs/config'
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
import { retry } from '@island.is/shared/utils/server'

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
  generateChargeFJSPayload,
  mapFjsErrorToCode,
} from '../../utils/fjsCharge'
import { processCharges } from '../../utils/chargeUtils'
import { PaymentFlowPaymentConfirmation } from './models/paymentFlowPaymentConfirmation.model'
import { ChargeResponse } from '../cardPayment/cardPayment.types'
import { PaymentTrackingData } from '../../types/cardPayment'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { generateWebhookJwt } from '../../utils/webhookAuth.utils'
import { JwksConfigService } from '../jwks/jwks-config.service'
import { ChargeItem } from '../../utils/chargeUtils'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'

interface PaymentFlowUpdateConfig {
  /**
   * Whether to use retry logic when notifying the onUpdateUrl
   * @default true
   */
  useRetry?: boolean
  /**
   * Whether to throw an error if the update notification fails
   * @default true
   */
  throwOnError?: boolean
}

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
    private jwksConfigService: JwksConfigService,
    @Inject(PaymentFlowModuleConfig.KEY)
    private readonly paymentFlowConfig: ConfigType<
      typeof PaymentFlowModuleConfig
    >,
    @Inject(JwksConfig.KEY)
    private readonly jwksConfig: ConfigType<typeof JwksConfig>,
  ) {}

  async createPaymentUrl(
    paymentInfo: CreatePaymentFlowInput,
  ): Promise<CreatePaymentFlowDTO> {
    try {
      const paymentFlowId = uuid()
      const processedCharges = processCharges(paymentInfo.charges)

      const chargeDetails = await this.getPaymentFlowChargeDetails(
        paymentInfo.organisationId,
        processedCharges,
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
        processedCharges.map((charge) => ({
          ...charge,
          paymentFlowId,
        })),
      )

      this.logger.info(
        `[${paymentFlow.id}] Payment flow created [${paymentFlow.organisationId}]`,
        {
          charges: processedCharges.map((c) => c.chargeItemCode),
        },
      )

      return {
        urls: {
          is: `${this.paymentFlowConfig.webOrigin}/is/${paymentFlow.id}`,
          en: `${this.paymentFlowConfig.webOrigin}/en/${paymentFlow.id}`,
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
        onlyReturnKnownErrorCode(
          e instanceof Error ? e.message : String(e),
          PaymentServiceCode.CouldNotCreatePaymentFlow,
        ),
      )
    }
  }

  async getPaymentFlowChargeDetails(
    organisationId: string,
    charges: ChargeItem[],
  ) {
    const { item } =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg(
        organisationId,
      )

    const filteredChargeInformation: CatalogItemWithQuantity[] = []

    for (const charge of charges) {
      const catalogProduct = item.find(
        (p) => p.chargeItemCode === charge.chargeItemCode,
      )

      if (!catalogProduct) {
        continue
      }

      const price = charge.price ?? catalogProduct.priceAmount

      filteredChargeInformation.push({
        ...catalogProduct,
        priceAmount: price,
        quantity: charge.quantity,
        chargeItemCode: catalogProduct.chargeItemCode,
      })
    }

    if (filteredChargeInformation.length !== charges.length) {
      this.logger.error(
        `[${organisationId}] Failed to create payment flow: charge item codes not found in FJS catalog or other mismatch.`,
        {
          inputCharges: charges.map((c) => c.chargeItemCode),
          filteredCharges: filteredChargeInformation.map(
            (c) => c.chargeItemCode,
          ),
          missingCharges: charges.filter(
            (c) =>
              !filteredChargeInformation.some(
                (i) => i.chargeItemCode === c.chargeItemCode,
              ),
          ),
        },
      )
      throw new BadRequestException(PaymentServiceCode.ChargeItemCodesNotFound)
    }

    return {
      firstProductTitle: filteredChargeInformation?.[0]?.chargeItemName ?? null,
      totalPrice: filteredChargeInformation.reduce(
        (acc, charge) => acc + charge.priceAmount * charge.quantity,
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
          {
            model: PaymentFlowFjsChargeConfirmation,
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

      if (chargeConfirmation) {
        paymentStatus = PaymentStatus.INVOICE_PENDING
      }

      if (chargeConfirmation) {
        updatedAt = chargeConfirmation.created
      }
    }

    console.log({
      paymentStatus,
    })

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

  async logPaymentFlowUpdate(
    update: {
      paymentFlowId: string
      type: PaymentFlowEvent['type']
      occurredAt: Date
      paymentMethod: PaymentMethod
      reason: PaymentFlowEvent['reason']
      message: string
      metadata?: object
    },
    config: PaymentFlowUpdateConfig = { useRetry: false, throwOnError: false },
  ) {
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

    const notifyUpdateUrl = async (attempt?: number) => {
      // Generate the JWT
      const token = generateWebhookJwt(
        { id: paymentFlow.id, onUpdateUrl: paymentFlow.onUpdateUrl },
        { type: update.type },
        updateBody,
        {
          ...this.jwksConfig,
          privateKey: this.jwksConfigService.getPrivateKey(),
        },
        this.logger,
      )

      const response = await fetch(paymentFlow.onUpdateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBody),
      })
      if (!response.ok) {
        const errorBody = await response
          .text()
          .catch(() => 'Could not read error body')
        this.logger.warn(
          `[${update.paymentFlowId}] Failed to notify onUpdateUrl [${
            update.type
          }]${attempt ? ` (attempt ${attempt})` : ''}: ${response.status} ${
            response.statusText
          }`,
          {
            url: paymentFlow.onUpdateUrl,
            responseBody: errorBody,
          },
        )
        if (config.throwOnError) {
          throw new Error(
            `Failed to notify onUpdateUrl: ${response.status} ${response.statusText}, body: ${errorBody}`,
          )
        }
      } else {
        this.logger.info(
          `[${update.paymentFlowId}] Successfully notified onUpdateUrl`,
          {
            url: paymentFlow.onUpdateUrl,
            type: update.type,
            reason: update.reason,
          },
        )
      }
    }

    if (config.useRetry) {
      await retry(notifyUpdateUrl, {
        maxRetries: 3,
        retryDelayMs: 1000,
        logger: this.logger,
        logPrefix: `[${update.paymentFlowId}] Notify onUpdateUrl for flow event type ${update.type}`,
      })
    } else {
      await notifyUpdateUrl()
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

  async deletePaymentCharge(paymentFlowId: string): Promise<void> {
    this.logger.info(`[${paymentFlowId}] Attempting to delete FJS charge`)
    try {
      // Delete from FJS
      await this.chargeFjsV2ClientService.deleteCharge(paymentFlowId)
      this.logger.info(
        `[${paymentFlowId}] Successfully requested deletion of FJS charge (or it was already deleted/cancelled)`,
      )

      // Delete local confirmation
      const deletedConfirmations =
        await this.paymentFlowFjsChargeConfirmationModel.destroy({
          where: {
            paymentFlowId,
          },
        })
      if (deletedConfirmations > 0) {
        this.logger.info(
          `[${paymentFlowId}] Deleted PaymentFlowFjsChargeConfirmation`,
        )
      } else {
        this.logger.warn(
          `[${paymentFlowId}] No PaymentFlowFjsChargeConfirmation found to delete`,
        )
      }
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] Failed to fully process FJS charge deletion or update local records`,
        { error: error.message, stack: error.stack },
      )
      // We don't rethrow here to allow the refund process to continue if possible,
      // but the error is logged for monitoring. Manual cleanup might be needed if FJS delete failed.
      // If FJS deletion fails critically, chargeFjsV2ClientService.deleteCharge should throw, which would be caught here.
    }
  }

  async deletePaymentFlow(id: string): Promise<GetPaymentFlowDTO> {
    const paymentFlowDetails = await this.getPaymentFlowDetails(id)

    const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
      paymentFlowDetails,
    )

    if (paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    // Construct the DTO to be returned before deleting
    const paymentDetails = await this.getPaymentFlowChargeDetails(
      paymentFlowDetails.organisationId,
      paymentFlowDetails.charges,
    )
    const payerName = await this.getPayerName(
      paymentFlowDetails.payerNationalId,
    )

    const paymentFlowDTO: GetPaymentFlowDTO = {
      ...paymentFlowDetails,
      productTitle:
        paymentFlowDetails.productTitle ?? paymentDetails.firstProductTitle,
      productPrice: paymentDetails.totalPrice,
      payerName,
      availablePaymentMethods:
        paymentFlowDetails.availablePaymentMethods as PaymentMethod[],
      paymentStatus,
      updatedAt,
    }

    if (paymentFlowDetails.onUpdateUrl) {
      await this.logPaymentFlowUpdate({
        paymentFlowId: id,
        type: 'deleted',
        occurredAt: new Date(),
        paymentMethod: 'system' as PaymentMethod,
        reason: 'deleted_admin', // TODO: connect with systemId when we have machine clients?
        message: 'Payment flow deleted by admin action.', // TODO: same as above?
      })
    }

    if (paymentFlowDetails.fjsChargeConfirmation) {
      await this.deletePaymentCharge(id)
    }

    // By deleting the payment flow, the related charges, events, and other
    // associated records will be deleted automatically by the database cascade.
    await this.paymentFlowModel.destroy({ where: { id } })

    return paymentFlowDTO
  }

  async deletePaymentConfirmation(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<void> {
    this.logger.info(
      `Attempting to delete payment confirmation for flow ${paymentFlowId} with correlation ID ${correlationId}`,
    )
    try {
      const deletedCount = await this.paymentFlowConfirmationModel.destroy({
        where: {
          id: correlationId,
          paymentFlowId: paymentFlowId,
        },
      })

      if (deletedCount > 0) {
        this.logger.info(
          `Successfully deleted payment confirmation for flow ${paymentFlowId}, correlation ID ${correlationId}`,
        )
      } else {
        this.logger.warn(
          `Payment confirmation not found or not deleted for flow ${paymentFlowId}, correlation ID ${correlationId}. It might have been already deleted or never existed with this ID for the given flow.`,
        )
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete payment confirmation for flow ${paymentFlowId}, correlation ID ${correlationId}`,
        { error },
      )
      // Not re-throwing, to prevent disruption of a primary flow (e.g., refund)
    }
  }
}
