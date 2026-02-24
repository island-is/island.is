import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cache as CacheManager } from 'cache-manager'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CardErrorCode, PaymentServiceCode } from '@island.is/shared/constants'

import { PaymentStatus } from '../../types'
import {
  ApplePaySessionResponseSchema,
  CachePaymentFlowStatus,
  CardPaymentResponseSchema,
  CardPaymentSuccessResponse,
  CardVerificationResponseSchema,
  CardVerificationSuccessResponse,
  MdNormalised,
  PaymentTrackingData,
  RefundResponseSchema,
  RefundSuccessResponse,
  SavedVerificationCompleteData,
  SavedVerificationPendingData,
} from '../../types/cardPayment'
import { CatalogItemWithQuantity } from '../../types/charges'
import { mapToCardErrorCode } from '../../utils/paymentErrors'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { paymentGatewayResponseCodes } from './cardPayment.constants'
import {
  generateApplePayChargeRequestOptions,
  generateApplePaySessionRequestOptions,
  generateChargeRequestOptions,
  generateMd,
  generateRefundRequestOptions,
  generateRefundWithCorrelationIdRequestOptions,
  generateVerificationRequestOptions,
  getPayloadFromMd,
} from './cardPayment.utils'
import {
  ApplePayChargeInput,
  ApplePaySessionResponse,
  ChargeCardInput,
  VerificationCallbackInput,
  VerifyCardInput,
} from './dtos'

@Injectable()
export class CardPaymentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CardPaymentModuleConfig.KEY)
    private readonly config: ConfigType<typeof CardPaymentModuleConfig>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
    private readonly paymentFlowService: PaymentFlowService,
  ) {}

  // VERIFICATION METHODS ------------------------------------------------------------------------------------------------

  async verify(
    verifyCardInput: VerifyCardInput,
    totalPrice: number,
  ): Promise<CardVerificationSuccessResponse> {
    const {
      memCacheExpiryMinutes,
      paymentGateway: {
        paymentsTokenSigningSecret,
        paymentsTokenSigningAlgorithm,
        paymentsGatewayApiUrl,
      },
    } = this.config

    const correlationId = uuid()

    const { paymentFlowId } = verifyCardInput

    const md = generateMd({
      correlationId,
      paymentFlowId,
      amount: totalPrice,
      paymentsTokenSigningSecret,
      paymentsTokenSigningAlgorithm,
    })

    const savedVerificationPendingData: SavedVerificationPendingData = {
      paymentFlowId,
    }

    await this.cacheManager.set(
      correlationId,
      savedVerificationPendingData,
      memCacheExpiryMinutes * 60000,
    )

    const requestOptions = generateVerificationRequestOptions({
      verifyCardInput,
      paymentApiConfig: this.config.paymentGateway,
      md: md,
      webOrigin: this.config.webOrigin,
      amount: totalPrice,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/CardVerification`,
      requestOptions,
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      response,
      schema: CardVerificationResponseSchema,
      errorMessage: `Failed to verify card (${paymentFlowId})`,
    })

    // Parser accepts success | error; we throw on !isSuccess, so this is always success shape
    return data as CardVerificationSuccessResponse
  }

  getMdPayload(md: string): MdNormalised {
    try {
      const {
        paymentGateway: { paymentsTokenSigningSecret },
      } = this.config

      const payload = getPayloadFromMd({
        md,
        paymentsTokenSigningSecret,
      })

      return payload
    } catch (e) {
      this.logger.error('Failed to get payload from md', e)
      throw new BadRequestException(PaymentServiceCode.InvalidVerificationToken)
    }
  }

  async getSavedVerificationPendingData(correlationId: string) {
    const savedVerificationPendingData = (await this.cacheManager.get(
      correlationId,
    )) as SavedVerificationPendingData

    if (!savedVerificationPendingData) {
      this.logger.error(
        'No saved verification pending data found for correlationId',
        correlationId,
      )
      throw new BadRequestException(PaymentServiceCode.InvalidVerificationToken)
    }

    return savedVerificationPendingData
  }

  async verifyThreeDSecureCallback({
    cardVerificationCallbackInput: { cavv, mdStatus, xid, dsTransId },
    mdPayload,
    savedVerificationPendingData,
  }: {
    cardVerificationCallbackInput: VerificationCallbackInput
    mdPayload: MdNormalised
    savedVerificationPendingData: SavedVerificationPendingData
  }) {
    const { tokenExpiryMinutes, memCacheExpiryMinutes } = this.config

    const { correlationId, issuedAt } = mdPayload

    const now = Date.now()
    const tokenExpiresAt = (issuedAt + tokenExpiryMinutes * 60) * 1000

    if (now > tokenExpiresAt) {
      this.logger.error('Token was expired', correlationId)
      throw new BadRequestException(PaymentServiceCode.InvalidVerificationToken)
    }

    const { paymentFlowId } = savedVerificationPendingData

    await this.cacheManager.del(correlationId)

    const savedVerificationCompleteData: SavedVerificationCompleteData = {
      cavv,
      mdStatus,
      xid,
      dsTransId,
    }

    // Save verified information to payment flow
    // to allow client (polling) to continue with payment using verification data
    await this.cacheManager.set(
      correlationId,
      savedVerificationCompleteData,
      memCacheExpiryMinutes * 60000,
    )

    const paymentFlowStatus: CachePaymentFlowStatus = {
      isVerified: true,
      correlationId,
    }

    await this.cacheManager.set(
      paymentFlowId,
      paymentFlowStatus,
      this.config.memCacheExpiryMinutes * 60000,
    )

    return {
      success: true,
      paymentFlowId,
    }
  }

  async getFullVerificationStatus(paymentFlowId: string) {
    return this.cacheManager.get(paymentFlowId) as
      | CachePaymentFlowStatus
      | undefined
  }

  async getVerificationStatus(paymentFlowId: string) {
    const status = await this.getFullVerificationStatus(paymentFlowId)

    const isVerified = status?.isVerified === true

    return {
      isVerified,
    }
  }

  // PAYMENT FLOW METHODS ------------------------------------------------------------------------------------------------

  async getPaymentFlowDetails(paymentFlowId: string): Promise<{
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
    paymentStatus: PaymentStatus
  }> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      paymentFlowId,
    )
    const [{ catalogItems, totalPrice }, { paymentStatus }] = await Promise.all(
      [
        this.paymentFlowService.getPaymentFlowChargeDetails(
          paymentFlow.organisationId,
          paymentFlow.charges,
        ),
        this.paymentFlowService.getPaymentFlowStatus(paymentFlow),
      ],
    )

    return {
      paymentFlow,
      catalogItems,
      totalPrice,
      paymentStatus,
    }
  }

  async validatePaymentFlow(paymentFlowId: string): Promise<{
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
    paymentStatus: PaymentStatus
  }> {
    const { paymentFlow, catalogItems, totalPrice, paymentStatus } =
      await this.getPaymentFlowDetails(paymentFlowId)

    if (paymentStatus === 'paid') {
      throw new BadRequestException(PaymentServiceCode.PaymentFlowAlreadyPaid)
    }

    // validate the payment flow against FJS
    await this.paymentFlowService.validateCharge(paymentFlow, catalogItems)

    return {
      paymentFlow,
      catalogItems,
      totalPrice,
      paymentStatus,
    }
  }

  // APPLE PAY METHODS ------------------------------------------------------------------------------------------------

  async getApplePaySession(): Promise<ApplePaySessionResponse> {
    const {
      paymentGateway: {
        applePayDomainName,
        applePayDisplayName,
        paymentsGatewayApiUrl,
      },
    } = this.config

    const requestOptions = generateApplePaySessionRequestOptions({
      domainName: applePayDomainName,
      displayName: applePayDisplayName,
      paymentApiConfig: this.config.paymentGateway,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/ApplePay/GetSession`,
      requestOptions,
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      response,
      schema: ApplePaySessionResponseSchema,
      errorMessage: 'Failed to get Apple Pay session',
    })

    if (!data.session) {
      throw new BadRequestException(CardErrorCode.ErrorGettingApplePaySession)
    }

    return {
      session: data.session,
    }
  }

  // CHARGE METHODS ------------------------------------------------------------------------------------------------

  async charge({
    chargeCardInput,
    paymentTrackingData,
    amount,
  }: {
    chargeCardInput: ChargeCardInput
    paymentTrackingData: PaymentTrackingData
    amount: number
  }): Promise<CardPaymentSuccessResponse> {
    const status = await this.getFullVerificationStatus(
      chargeCardInput.paymentFlowId,
    )

    if (!status?.isVerified || !status?.correlationId) {
      throw new BadRequestException(PaymentServiceCode.MissingVerification)
    }

    const { correlationId } = status

    const verificationData = (await this.cacheManager.get(
      correlationId,
    )) as SavedVerificationCompleteData

    if (!verificationData) {
      throw new BadRequestException(PaymentServiceCode.MissingVerification)
    }

    if (
      !verificationData.cavv ||
      !verificationData.mdStatus ||
      !verificationData.xid ||
      !verificationData.dsTransId
    ) {
      throw new BadRequestException(PaymentServiceCode.MissingVerification)
    }

    const {
      paymentGateway: { paymentsGatewayApiUrl },
    } = this.config

    const requestOptions = generateChargeRequestOptions({
      chargeCardInput,
      verificationData,
      paymentApiConfig: this.config.paymentGateway,
      paymentTrackingData,
      amount,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/CardPayment`,
      requestOptions,
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      response,
      schema: CardPaymentResponseSchema,
      errorMessage: 'Failed to charge card',
    })

    try {
      await this.cacheManager.del(correlationId)
      await this.cacheManager.del(chargeCardInput.paymentFlowId)
    } catch (e) {
      this.logger.error(
        'Failed to clear cache after a successful card payment',
        e,
      )
    }

    return data as CardPaymentSuccessResponse
  }

  async chargeApplePay(
    input: ApplePayChargeInput,
    paymentTrackingData: PaymentTrackingData,
  ): Promise<CardPaymentSuccessResponse> {
    const { paymentsGatewayApiUrl } = this.config.paymentGateway

    const requestOptions = generateApplePayChargeRequestOptions({
      input,
      paymentApiConfig: this.config.paymentGateway,
      paymentTrackingData,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
      requestOptions,
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      response,
      schema: CardPaymentResponseSchema,
      errorMessage: 'Failed to charge Apple Pay payment',
    })

    return data as CardPaymentSuccessResponse
  }

  // REFUND METHODS ------------------------------------------------------------------------------------------------

  async refund({
    paymentFlowId,
    cardNumber,
    acquirerReferenceNumber,
    amount,
  }: {
    paymentFlowId: string
    cardNumber: string
    amount: number
    acquirerReferenceNumber: string
  }): Promise<RefundSuccessResponse> {
    try {
      const requestOptions = generateRefundRequestOptions({
        amount,
        cardNumber,
        paymentApiConfig: this.config.paymentGateway,
        acquirerReferenceNumber,
      })

      const {
        paymentGateway: { paymentsGatewayApiUrl },
      } = this.config

      const response = await fetch(
        `${paymentsGatewayApiUrl}/Payment/CardPayment`,
        requestOptions,
      )

      const data = await this.parsePaymentGatewayResponseAndHandleErrors({
        response,
        schema: RefundResponseSchema,
        errorMessage: `[${paymentFlowId}] Failed to refund payment`,
        onErrorBeforeThrow: async (data) => {
          if (
            data.responseCode?.startsWith(
              paymentGatewayResponseCodes.INVALID_3D_SECURE_DATA,
            )
          ) {
            const cachedPaymentFlowStatus = (await this.cacheManager.get(
              paymentFlowId,
            )) as CachePaymentFlowStatus | undefined
            if (cachedPaymentFlowStatus) {
              // If there was an error with the 3D secure data, we need to remove the payment flow status
              // to allow the client to retry the payment
              await this.cacheManager.del(paymentFlowId)
            }
          }
        },
      })

      return data as RefundSuccessResponse
    } catch (e) {
      this.logger.error(`[${paymentFlowId}] Failed to refund payment`, e)
      throw e
    }
  }

  async refundWithCorrelationId({
    paymentTrackingData,
  }: {
    paymentTrackingData: PaymentTrackingData
  }): Promise<RefundSuccessResponse> {
    const { paymentsGatewayApiUrl } = this.config.paymentGateway

    const requestOptions = generateRefundWithCorrelationIdRequestOptions({
      paymentApiConfig: this.config.paymentGateway,
      paymentTrackingData,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/RefundWithCorrelationId`,
      requestOptions,
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      response,
      schema: RefundResponseSchema,
      errorMessage: 'Failed to refund payment with correlation id',
    })

    return data as RefundSuccessResponse
  }

  async persistPaymentConfirmation({
    paymentFlowId,
    paymentResult,
    paymentTrackingData,
    totalPrice,
  }: {
    paymentFlowId: string
    paymentResult: CardPaymentSuccessResponse
    paymentTrackingData: PaymentTrackingData
    totalPrice: number
  }) {
    await this.paymentFlowService.createCardPaymentConfirmation({
      paymentResult,
      paymentFlowId: paymentFlowId,
      totalPrice,
      paymentTrackingData,
    })
  }

  // PRIVATE HELPER METHODS ------------------------------------------------------------------------------------------------

  private async parsePaymentGatewayResponseAndHandleErrors<
    T extends z.ZodTypeAny,
  >({
    response,
    schema,
    errorMessage,
    onErrorBeforeThrow,
  }: {
    response: Response
    schema: T
    errorMessage: string
    /** Called when !isSuccess, before throwing. Used for refund's INVALID_3D_SECURE_DATA cache cleanup. */
    onErrorBeforeThrow?: (data: z.infer<T>) => void | Promise<void>
  }): Promise<z.infer<T>> {
    if (!response.ok) {
      const responseBody = await response.text()

      this.logger.error(errorMessage, {
        statusText: response.statusText,
        responseBody,
      })

      throw new BadRequestException(response.statusText)
    }

    const data = await response.json()

    const parsedData = schema.safeParse(data)

    if (!parsedData.success) {
      this.logger.error('Failed to parse payment gateway response', {
        error: parsedData.error,
      })
      throw new BadRequestException(parsedData.error.message)
    }

    const { isSuccess, responseCode, responseDescription } = parsedData.data

    if (!isSuccess) {
      await onErrorBeforeThrow?.(parsedData.data)
      this.logger.error(`Payment gateway error: ${errorMessage}`, {
        responseCode,
        responseDescription,
      })
      throw new BadRequestException(mapToCardErrorCode(responseCode))
    }

    return parsedData.data
  }
}
