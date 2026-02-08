import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { InferAttributes, Sequelize, WhereOptions } from 'sequelize'
import { ConfigType } from '@nestjs/config'
import { isCompany, isValid } from 'kennitala'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  Charge,
} from '@island.is/clients/charge-fjs-v2'
import { Op } from 'sequelize'
import { retry } from '@island.is/shared/utils/server'
import { paginate } from '@island.is/nest/pagination'
import {
  FjsErrorCode,
  InvoiceErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import {
  PaymentFlow,
  PaymentFlowAttributes,
  PaymentFlowCharge,
} from './models/paymentFlow.model'

import {
  PaymentFlowUpdateEvent,
  PaymentMethod,
  PaymentStatus,
  PaymentFlowEventType,
  PaymentFlowEventReason,
} from '../../types'
import { GetPaymentFlowDTO } from './dtos/getPaymentFlow.dto'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { GetPaymentFlowsPaginatedDTO } from './dtos/getPaymentFlow.dto'

import { environment } from '../../environments'
import { PaymentFlowEvent } from './models/paymentFlowEvent.model'
import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'
import { FjsCharge } from './models/fjsCharge.model'
import { CatalogItemWithQuantity } from '../../types/charges'
import {
  generateChargeFJSPayload,
  mapFjsErrorToCode,
} from '../../utils/fjsCharge'
import { processCharges } from '../../utils/chargeUtils'
import { CardPaymentDetails } from './models/cardPaymentDetails.model'
import {
  CardPaymentResponse,
  PaymentTrackingData,
} from '../../types/cardPayment'
import { onlyReturnKnownErrorCode } from '../../utils/paymentErrors'
import { generateWebhookJwt } from '../../utils/webhookAuth.utils'
import { JwksConfigService } from '../jwks/jwks-config.service'
import { ChargeItem } from '../../utils/chargeUtils'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFulfillment } from './models/paymentFulfillment.model'

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
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
    @InjectModel(PaymentFlowCharge)
    private readonly paymentFlowChargeModel: typeof PaymentFlowCharge,
    @InjectModel(PaymentFlowEvent)
    private readonly paymentFlowEventModel: typeof PaymentFlowEvent,
    @InjectModel(FjsCharge)
    private readonly fjsChargeModel: typeof FjsCharge,
    @InjectModel(CardPaymentDetails)
    private readonly cardPaymentDetailsModel: typeof CardPaymentDetails,
    @InjectModel(PaymentFulfillment)
    private readonly paymentFulfillmentModel: typeof PaymentFulfillment,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
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
          returnUrl: paymentInfo.returnUrl,
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
        id: paymentFlow.id,
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
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg({
        performingOrgID: organisationId,
        // chargeType: charges[0].chargeType,
        // chargeItemCode: charges.map((c) => c.chargeItemCode),
      })

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

  private async getPayerName(payerNationalId: string): Promise<string> {
    if (!isValid(payerNationalId)) {
      throw new BadRequestException(PaymentServiceCode.InvalidPayerNationalId)
    }

    let payerName: string | null = null

    try {
      const payeeInfo = await this.chargeFjsV2ClientService.getPayeeInfo(
        payerNationalId,
      )

      payerName = payeeInfo.name
    } catch (e) {
      this.logger.error(`Failed to get payer name from FJS`, { error: e })
    }

    if (payerName === null || payerName.length === 0) {
      if (isCompany(payerNationalId)) {
        throw new BadRequestException(PaymentServiceCode.CompanyNotFound)
      }

      throw new BadRequestException(PaymentServiceCode.PersonNotFound)
    }

    return payerName
  }

  /**
   * Checks if a payment flow is eligible to be paid.
   * Returns true if the payment flow is eligible to be paid, false if it has already been paid.
   */
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

    const paymentFulfillment = (
      await this.paymentFulfillmentModel.findOne({
        where: {
          paymentFlowId: id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    if (paymentFulfillment) {
      return false
    }

    // TODO: look for fjs charge (invoice pending?)

    return true
  }

  async getPaymentFlowDetails(id: string, includeEvents?: boolean) {
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
            model: FjsCharge,
          },
          ...(includeEvents
            ? [
                {
                  model: PaymentFlowEvent,
                  as: 'events',
                },
              ]
            : []),
        ],
      })
    )?.toJSON()

    if (!paymentFlow) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    return paymentFlow
  }

  async getPaymentFlowStatus(paymentFlow: PaymentFlowAttributes) {
    const paymentFulfillment = (
      await this.paymentFulfillmentModel.findOne({
        where: {
          paymentFlowId: paymentFlow.id,
          isDeleted: false,
        },
      })
    )?.toJSON()

    // If a payment fulfillment exists, the payment flow is paid by card
    if (paymentFulfillment) {
      return {
        paymentStatus: PaymentStatus.PAID,
        updatedAt: paymentFulfillment.created,
      }
    }

    // for invoice payments, we need to check the status of the fjs charge
    const existingFjsCharge = (
      await this.fjsChargeModel.findOne({
        where: {
          paymentFlowId: paymentFlow.id,
        },
      })
    )?.toJSON()

    // If the fjs charge exists and is unpaid, the invoice is pending
    if (existingFjsCharge && existingFjsCharge.status === 'unpaid') {
      return {
        paymentStatus: PaymentStatus.INVOICE_PENDING,
        updatedAt: existingFjsCharge.created,
      }
    }

    // If neither the payment fulfillment nor the fjs charge exist, the payment flow is unpaid
    return {
      paymentStatus: PaymentStatus.UNPAID,
      updatedAt: existingFjsCharge?.created ?? paymentFlow.modified,
    }
  }

  async getPaymentFlow(
    id: string,
    includeEvents?: boolean,
  ): Promise<GetPaymentFlowDTO | null> {
    try {
      const paymentFlow = await this.getPaymentFlowDetails(id, includeEvents)
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
        events: includeEvents
          ? paymentFlow.events?.map((event) => ({
              ...event,
              type: event.type as PaymentFlowEventType,
              reason: event.reason as PaymentFlowEventReason,
            }))
          : undefined,
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
      try {
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
          const errorMessage = `Failed to notify onUpdateUrl: ${response.status} ${response.statusText}, body: ${errorBody}`

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

          // Update delivery status to failed
          await this.updateEventDeliveryStatus(
            eventRecord.id,
            false,
            errorMessage,
          )

          if (config.throwOnError) {
            throw new Error(errorMessage)
          }
        } else {
          // Update delivery status to successful
          await this.updateEventDeliveryStatus(eventRecord.id, true)

          this.logger.info(
            `[${update.paymentFlowId}] Successfully notified onUpdateUrl`,
            {
              url: paymentFlow.onUpdateUrl,
              type: update.type,
              reason: update.reason,
            },
          )
        }
      } catch (error) {
        // Update delivery status to failed
        await this.updateEventDeliveryStatus(
          eventRecord.id,
          false,
          error.message,
        )

        if (config.throwOnError) {
          throw error
        }
      }
    }

    // Save event to database first, then attempt delivery
    let eventRecord: PaymentFlowEvent
    try {
      eventRecord = await this.paymentFlowEventModel.create({
        ...update,
        deliveredToUpstream: null, // Will be updated after delivery attempt
        deliveredAt: null,
        deliveryError: null,
      })
    } catch (e) {
      this.logger.error(
        `[${update.paymentFlowId}] Failed to create payment flow event record`,
        { error: e },
      )
      throw e // Don't proceed if we can't create the record
    }

    // Now attempt delivery with the event record already saved
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
  }

  /**
   * Updates the delivery status of a payment flow event.
   * This allows tracking which events were successfully delivered to upstream systems.
   */
  private async updateEventDeliveryStatus(
    eventId: string,
    delivered: boolean,
    error?: string,
  ): Promise<void> {
    try {
      await this.paymentFlowEventModel.update(
        {
          deliveredToUpstream: delivered,
          deliveredAt: delivered ? new Date() : null,
          deliveryError: delivered ? null : error,
        },
        {
          where: { id: eventId },
        },
      )
    } catch (updateError) {
      this.logger.error(
        `Failed to update delivery status for event ${eventId}`,
        { error: updateError },
      )
      // Don't throw - this is not critical enough to fail the main operation
    }
  }

  /**
   * Gets all events that failed to deliver to upstream systems.
   * Useful for retry mechanisms and monitoring.
   */
  async getFailedDeliveryEvents(): Promise<PaymentFlowEvent[]> {
    return await this.paymentFlowEventModel.findAll({
      where: {
        deliveredToUpstream: false,
      },
      order: [['created', 'ASC']],
    })
  }

  async createCardPaymentConfirmation({
    paymentResult,
    paymentFlowId,
    totalPrice,
    paymentTrackingData,
  }: {
    paymentResult: CardPaymentResponse
    paymentFlowId: string
    totalPrice: number
    paymentTrackingData: PaymentTrackingData
  }) {
    try {
      return await retry(
        async () => {
          const confirmation = await this.cardPaymentDetailsModel.create({
            id: paymentTrackingData.correlationId,
            acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
            authorizationCode: paymentResult.authorizationCode,
            cardScheme: paymentResult.cardInformation.cardScheme,
            maskedCardNumber: paymentResult.maskedCardNumber,
            paymentFlowId,
            cardUsage: paymentResult.cardInformation.cardUsage,
            totalPrice,
            merchantReferenceData: paymentTrackingData.merchantReferenceData,
          })

          await this.paymentFulfillmentModel.create({
            paymentFlowId,
            paymentMethod: 'card',
            confirmationRefId: confirmation.id,
          })

          return confirmation
        },
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

  async findPaymentFulfillmentForPaymentFlow(paymentFlowId: string) {
    const paymentFulfillment = await this.paymentFulfillmentModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    return paymentFulfillment?.toJSON() ?? null
  }

  /**
   * Creates an invoice payment confirmation for a completed FJS charge.
   * This method is idempotent - calling it multiple times with the same parameters
   * will not create duplicate fulfillments.
   *
   * @param paymentFlowId - The payment flow ID
   * @param receptionId - The FJS reception ID from the callback
   * @returns Promise<void>
   * @throws BadRequestException if FJS charge not found or processing fails
   */
  async createInvoicePaymentConfirmation(
    paymentFlowId: string,
    receptionId: string,
  ): Promise<void> {
    const fjsCharge = await this.findFjsChargeByReceptionId(
      paymentFlowId,
      receptionId,
    )

    await this.processInvoicePaymentWithRetry(paymentFlowId, fjsCharge)
  }

  /**
   * Finds an FJS charge by reception ID and validates it belongs to the payment flow.
   * This provides an additional security check in case of token issues.
   */
  private async findFjsChargeByReceptionId(
    paymentFlowId: string,
    receptionId: string,
  ) {
    const fjsCharge = await this.fjsChargeModel.findOne({
      where: { paymentFlowId, receptionId },
    })

    if (!fjsCharge) {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowNotFound)
    }

    return fjsCharge
  }

  /**
   * Processes the invoice payment with retry logic for transient failures.
   * Handles race conditions gracefully by treating duplicate fulfillments as success.
   */
  private async processInvoicePaymentWithRetry(
    paymentFlowId: string,
    fjsCharge: { id: string },
  ): Promise<void> {
    try {
      await retry(
        () => this.createInvoicePaymentFulfillment(paymentFlowId, fjsCharge),
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          logger: this.logger,
          logPrefix: 'Failed to create invoice payment confirmation',
          shouldRetryOnError: this.shouldRetryInvoicePayment,
        },
      )
    } catch (error) {
      this.handleInvoicePaymentError(paymentFlowId, error)
    }
  }

  /**
   * Creates the payment fulfillment and updates the FJS charge status atomically.
   * This method is idempotent - if a fulfillment already exists, it returns early.
   */
  private async createInvoicePaymentFulfillment(
    paymentFlowId: string,
    fjsCharge: { id: string },
  ): Promise<void> {
    return await this.sequelize.transaction(async (transaction) => {
      // Check if already processed (idempotency)
      const existingFulfillment = await this.paymentFulfillmentModel.findOne({
        where: { paymentFlowId, paymentMethod: 'invoice', isDeleted: false },
        transaction,
      })

      if (existingFulfillment) {
        this.logger.info(
          `[${paymentFlowId}] Invoice payment fulfillment already exists`,
        )
        return
      }

      // Create fulfillment and update charge status atomically
      await this.paymentFulfillmentModel.create(
        {
          paymentFlowId,
          paymentMethod: 'invoice',
          confirmationRefId: fjsCharge.id,
          fjsChargeId: fjsCharge.id,
        },
        { transaction },
      )

      await this.fjsChargeModel.update(
        { status: 'paid' },
        { where: { id: fjsCharge.id }, transaction },
      )

      this.logger.info(
        `[${paymentFlowId}] Successfully created invoice payment fulfillment`,
        { chargeId: fjsCharge.id },
      )
    })
  }

  /**
   * Determines whether an error should trigger a retry.
   * Race conditions (unique constraint errors) are treated as success.
   */
  private shouldRetryInvoicePayment = (error: Error): boolean => {
    // Don't retry on race conditions - they indicate success
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return false
    }

    // Retry on transient database errors
    return true
  }

  /**
   * Handles errors from invoice payment processing.
   * Race conditions are treated as success since the payment was already processed.
   */
  private handleInvoicePaymentError(paymentFlowId: string, error: Error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      this.logger.info(
        `[${paymentFlowId}] Invoice payment already processed (race condition)`,
      )
      return
    }

    this.logger.error(
      `[${paymentFlowId}] Failed to create invoice payment confirmation`,
      error,
    )

    throw new BadRequestException(
      InvoiceErrorCode.FailedToCreateInvoiceConfirmation,
    )
  }

  async createFjsCharge(paymentFlowId: string, chargePayload: Charge) {
    try {
      const charge = await this.chargeFjsV2ClientService.createCharge(
        chargePayload,
      )

      const newCharge = await this.fjsChargeModel.create({
        paymentFlowId,
        receptionId: charge.receptionID,
        user4: charge.user4,
        status: chargePayload.payInfo ? 'paid' : 'unpaid',
      })

      await this.updateFlowAndFulfillmentWithFjsCharge(
        paymentFlowId,
        charge.receptionID,
        newCharge.id,
        !!chargePayload.payInfo,
      )

      return newCharge
    } catch (e) {
      const code = mapFjsErrorToCode(e, true)
      if (code === FjsErrorCode.AlreadyCreatedCharge) {
        this.logger.error(
          `CRITICAL: [${paymentFlowId}] FJS charge already exists but flow/fulfillment not updated. Manual reconciliation required.`,
          e,
        )
      } else {
        this.logger.error(
          `Failed to create payment charge (${paymentFlowId})`,
          e,
        )
      }
      throw new BadRequestException(mapFjsErrorToCode(e))
    }
  }

  private async updateFlowAndFulfillmentWithFjsCharge(
    paymentFlowId: string,
    receptionId: string,
    fjsChargeId: string,
    hasPayInfo: boolean,
  ): Promise<void> {
    await this.paymentFlowModel.update(
      { existingInvoiceId: receptionId },
      { where: { id: paymentFlowId } },
    )

    if (hasPayInfo) {
      await this.paymentFulfillmentModel.update(
        { fjsChargeId },
        { where: { paymentFlowId, isDeleted: false } },
      )
    }
  }

  /**
   * Finds paid card payment flows that don't have an FJS charge yet.
   * Used by the FJS worker to backfill missing charges.
   *
   * @param cutoffTime - Only include flows whose fulfillment was created before this time (gives other systems time to finalize)
   */
  async findPaidFlowsWithoutFjsCharge(
    cutoffTime: Date,
  ): Promise<InferAttributes<PaymentFlow>[]> {
    const paymentFlows = await this.paymentFlowModel.findAll({
      include: [
        {
          model: PaymentFulfillment,
          as: 'paymentFulfillment',
          required: true,
          where: {
            paymentMethod: 'card',
            fjsChargeId: null,
            created: { [Op.lt]: cutoffTime },
            isDeleted: false,
          },
        },
        { model: PaymentFlowCharge, as: 'charges' },
        {
          model: CardPaymentDetails,
          as: 'cardPaymentDetails',
          required: true,
          where: { isDeleted: false },
        },
      ],
    })

    return paymentFlows
  }

  async deleteFjsCharge(paymentFlowId: string): Promise<void> {
    this.logger.info(`[${paymentFlowId}] Attempting to delete FJS charge`)
    try {
      // Delete from FJS
      await this.chargeFjsV2ClientService.deleteCharge(paymentFlowId)
      this.logger.info(
        `[${paymentFlowId}] Successfully requested deletion of FJS charge (or it was already deleted/cancelled)`,
      )

      // Delete local confirmation
      const deletedConfirmations = await this.fjsChargeModel.destroy({
        where: {
          paymentFlowId,
        },
      })
      if (deletedConfirmations > 0) {
        this.logger.info(`[${paymentFlowId}] Deleted FjsCharge`)
      } else {
        this.logger.warn(`[${paymentFlowId}] No FjsCharge found to delete`)
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
      events: paymentFlowDetails.events?.map((event) => ({
        ...event,
        type: event.type as PaymentFlowEventType,
        reason: event.reason as PaymentFlowEventReason,
      })),
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

    if (paymentFlowDetails.fjsCharge) {
      await this.deleteFjsCharge(id)
    }

    // By deleting the payment flow, the related charges, events, and other
    // associated records will be deleted automatically by the database cascade.
    await this.paymentFlowModel.destroy({ where: { id } })

    return paymentFlowDTO
  }

  async getCardPaymentConfirmationForPaymentFlow(paymentFlowId: string) {
    const cardPaymentConfirmation = await this.cardPaymentDetailsModel.findOne({
      where: { paymentFlowId, isDeleted: false },
    })

    return cardPaymentConfirmation?.toJSON() ?? null
  }

  async deleteCardPaymentConfirmation(
    paymentFlowId: string,
    correlationId: string,
  ): Promise<InferAttributes<CardPaymentDetails> | null> {
    this.logger.info(
      `Attempting to delete payment confirmation for flow ${paymentFlowId} with correlation ID ${correlationId}`,
    )
    try {
      const [updatedCount, [updatedCardPaymentDetails]] =
        await this.cardPaymentDetailsModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              id: correlationId,
              paymentFlowId: paymentFlowId,
              isDeleted: false,
            },
            returning: true,
          },
        )

      if (updatedCount > 0) {
        this.logger.info(
          `Successfully marked payment confirmation for flow ${paymentFlowId}, correlation ID ${correlationId} as deleted`,
        )
      } else {
        this.logger.warn(
          `Payment confirmation not found or not marked as deleted for flow ${paymentFlowId}, correlation ID ${correlationId}. It might have been already deleted or never existed with this ID for the given flow.`,
        )
      }

      return updatedCardPaymentDetails?.toJSON() ?? null
    } catch (error) {
      this.logger.error(
        `Failed to delete payment confirmation for flow ${paymentFlowId}, correlation ID ${correlationId}`,
        { error },
      )
      // Not re-throwing, to prevent disruption of a primary flow (e.g., refund)
      return null
    }
  }

  async deletePaymentFulfillment({
    paymentFlowId,
    confirmationRefId,
    correlationId,
  }: {
    paymentFlowId: string
    confirmationRefId: string
    correlationId: string
  }): Promise<InferAttributes<PaymentFulfillment> | null> {
    this.logger.info(
      `Attempting to delete payment fulfillment for flow ${paymentFlowId} with correlation ID ${correlationId}`,
    )
    try {
      const [updatedCount, [updatedPaymentFulfillment]] =
        await this.paymentFulfillmentModel.update(
          {
            isDeleted: true,
          },
          {
            where: {
              confirmationRefId: confirmationRefId,
              paymentFlowId: paymentFlowId,
              isDeleted: false,
            },
            returning: true,
          },
        )
      if (updatedCount > 0) {
        this.logger.info(
          `Successfully marked payment fulfillment for flow ${paymentFlowId}, correlation ID ${correlationId} as deleted`,
        )
      } else {
        this.logger.warn(
          `Payment fulfillment not found or not marked as deleted for flow ${paymentFlowId}, correlation ID ${correlationId}. It might have been already deleted or never existed with this ID for the given flow.`,
        )
      }

      return updatedPaymentFulfillment?.toJSON() ?? null
    } catch (error) {
      this.logger.error(
        `Failed to delete payment fulfillment for flow ${paymentFlowId}, correlation ID ${correlationId}`,
        { error },
      )
      // Not re-throwing, to prevent disruption of a primary flow (e.g., refund)
      return null
    }
  }
  async searchPaymentFlows(
    payerNationalId?: string,
    search?: string,
    limit?: number,
    after?: string,
    before?: string,
  ): Promise<GetPaymentFlowsPaginatedDTO> {
    const where: WhereOptions<PaymentFlow> = {}

    if (payerNationalId && isValid(payerNationalId)) {
      where.payerNationalId = payerNationalId
    }

    if (search && search !== '') {
      where.id = search
    }

    const paginatedResult = await paginate({
      Model: this.paymentFlowModel,
      primaryKeyField: 'id',
      orderOption: [['created', 'DESC']],
      where,
      after: after || '',
      before: before,
      limit: limit || 10,
      distinctCol: this.paymentFlowModel.primaryKeyAttribute,
      include: [
        {
          model: PaymentFlowCharge,
          as: 'charges',
        },
      ],
    })

    const paymentFlowDtos = await Promise.all(
      paginatedResult.data.map(async (flow) => {
        const paymentDetails = await this.getPaymentFlowChargeDetails(
          flow.organisationId,
          flow.charges,
        )
        const { paymentStatus, updatedAt } = await this.getPaymentFlowStatus(
          flow,
        )
        const payerName = await this.getPayerName(flow.payerNationalId)

        return {
          ...flow.toJSON(),
          productTitle: flow.productTitle ?? paymentDetails.firstProductTitle,
          productPrice: paymentDetails.totalPrice,
          payerName,
          availablePaymentMethods:
            flow.availablePaymentMethods as PaymentMethod[],
          paymentStatus,
          updatedAt,
        }
      }),
    )

    return {
      data: paymentFlowDtos,
      totalCount: paginatedResult.totalCount,
      pageInfo: paginatedResult.pageInfo,
    }
  }
}
