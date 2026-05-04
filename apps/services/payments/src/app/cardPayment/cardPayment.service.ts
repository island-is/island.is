import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cache as CacheManager } from 'cache-manager'
import crypto from 'crypto'
import { Agent } from 'undici'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CardErrorCode, PaymentServiceCode } from '@island.is/shared/constants'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

import { PaymentStatus } from '../../types'
import {
  CachePaymentFlowStatus,
  CardPaymentErrorSchema,
  CardPaymentSuccessResponse,
  CardPaymentSuccessSchema,
  CardVerificationErrorSchema,
  CardVerificationSuccessResponse,
  CardVerificationSuccessSchema,
  MdNormalised,
  PaymentTrackingData,
  RefundErrorSchema,
  RefundSuccessResponse,
  RefundSuccessSchema,
  SavedVerificationCompleteData,
  SavedVerificationPendingData,
} from '../../types/cardPayment'
import { CatalogItemWithQuantity } from '../../types/charges'
import { mapToCardErrorCode } from '../../utils/paymentErrors'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { paymentGatewayResponseCodes } from './cardPayment.constants'
import { verifyApplePaySignature } from './applePaySignature'
import {
  decryptApplePayPaymentToken,
  generateApplePayDecryptedChargeRequestOptions,
  generateApplePayValidationRequestOptions,
  generateChargeRequestOptions,
  generateMd,
  generateRefundRequestOptions,
  generateVerificationRequestOptions,
  getPayloadFromMd,
  validateAndParseApplePayValidationUrl,
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
  /** Memoized mTLS dispatcher for Apple Pay merchant validation; built on first use. */
  private applePayMerchantAgent: Agent | null = null
  /** True once we've parsed the Apple Pay payment processing PEM successfully. */
  private applePayProcessingKeyValidated = false

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CardPaymentModuleConfig.KEY)
    private readonly config: ConfigType<typeof CardPaymentModuleConfig>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
    private readonly paymentFlowService: PaymentFlowService,
    private readonly featureFlagService: FeatureFlagService,
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
      paymentFlowId,
      response,
      schema: CardVerificationSuccessSchema,
      errorSchema: CardVerificationErrorSchema,
      errorMessage: `Failed to verify card (${paymentFlowId})`,
    })

    if (!data.cardInformation?.cardScheme || !data.cardInformation?.cardUsage) {
      throw new BadRequestException(CardErrorCode.VerificationFailed)
    }

    return data
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

  private requireMerchantIdentityConfig() {
    const {
      applePayMerchantIdentifier,
      applePayMerchantIdentityCert,
      applePayMerchantIdentityKey,
      applePayDomainName,
      applePayDisplayName,
    } = this.config.paymentGateway

    if (
      !applePayMerchantIdentifier ||
      !applePayMerchantIdentityCert ||
      !applePayMerchantIdentityKey
    ) {
      throw new BadRequestException(CardErrorCode.ApplePayNotConfigured)
    }

    return {
      applePayMerchantIdentifier,
      applePayMerchantIdentityCert,
      applePayMerchantIdentityKey,
      applePayDomainName,
      applePayDisplayName,
    }
  }

  /** Payment Processing PEM key + Merchant ID (KDF Party V) required for EC_v1 decryption */
  private requireApplePayDecryptionConfig() {
    const { applePayPaymentProcessingKey, applePayMerchantIdentifier } =
      this.config.paymentGateway

    if (!applePayPaymentProcessingKey || !applePayMerchantIdentifier) {
      throw new BadRequestException(CardErrorCode.ApplePayNotConfigured)
    }

    return { applePayPaymentProcessingKey, applePayMerchantIdentifier }
  }

  /**
   * Parse the payment processing PEM once on first use so a misconfigured key
   * surfaces as ApplePayNotConfigured instead of an opaque decrypt failure.
   * Env vars are only present in prod, so we can't validate at module load.
   */
  private validateApplePayProcessingKeyOnce(processingKeyPem: string) {
    if (this.applePayProcessingKeyValidated) {
      return
    }

    try {
      crypto.createPrivateKey({ key: processingKeyPem, format: 'pem' })
    } catch {
      throw new BadRequestException(CardErrorCode.ApplePayNotConfigured)
    }

    this.applePayProcessingKeyValidated = true
  }

  /** Build (or return memoized) mTLS dispatcher for Apple Pay merchant validation. */
  private getApplePayMerchantAgent(cert: string, key: string): Agent {
    if (!this.applePayMerchantAgent) {
      this.applePayMerchantAgent = new Agent({
        connect: { cert, key },
      })
    }

    return this.applePayMerchantAgent
  }

  async validateApplePayMerchant(
    validationURL: string,
  ): Promise<ApplePaySessionResponse> {
    const {
      applePayMerchantIdentifier,
      applePayMerchantIdentityCert,
      applePayMerchantIdentityKey,
      applePayDomainName,
      applePayDisplayName,
    } = this.requireMerchantIdentityConfig()

    // SSRF guard: re-validate the URL host at the fetch site.
    validateAndParseApplePayValidationUrl(validationURL)

    const dispatcher = this.getApplePayMerchantAgent(
      applePayMerchantIdentityCert,
      applePayMerchantIdentityKey,
    )

    const requestOptions = generateApplePayValidationRequestOptions({
      validationURL,
      merchantIdentifier: applePayMerchantIdentifier,
      displayName: applePayDisplayName,
      initiativeContext: applePayDomainName,
      dispatcher,
    })

    let response: Response
    try {
      response = await fetch(validationURL, requestOptions)
    } catch (e) {
      this.logger.error('Apple Pay merchant validation fetch failed', {
        validationURL,
        error: (e as Error).message,
      })
      throw e
    }

    if (!response.ok) {
      const responseBody = await response.text()
      this.logger.error('Apple Pay merchant validation returned non-OK', {
        validationURL,
        status: response.status,
        statusText: response.statusText,
        responseBody,
      })
      throw new BadRequestException(
        `Apple Pay validation failed: ${response.status} ${responseBody}`,
      )
    }

    const data = await response.json()
    const session = JSON.stringify(data)

    return { session }
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
      paymentFlowId: chargeCardInput.paymentFlowId,
      response,
      schema: CardPaymentSuccessSchema,
      errorSchema: CardPaymentErrorSchema,
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
    totalPrice: number,
  ): Promise<CardPaymentSuccessResponse> {
    const { paymentFlowId, transactionIdentifier } = input
    const logPrefix = `[${paymentFlowId}]`

    this.logger.info(`${logPrefix} Apple Pay charge started`, {
      paymentFlowId,
      totalPrice,
      tokenVersion: input.paymentData.version,
      transactionIdentifier,
      correlationId: paymentTrackingData.correlationId,
      merchantReferenceData: paymentTrackingData.merchantReferenceData,
    })

    const { applePayPaymentProcessingKey, applePayMerchantIdentifier } =
      this.requireApplePayDecryptionConfig()

    this.validateApplePayProcessingKeyOnce(applePayPaymentProcessingKey)

    // Reject replay of a previously seen Apple Pay token.
    const replayCacheKey = this.applePayReplayCacheKey(transactionIdentifier)
    const alreadySeen = await this.cacheManager.get(replayCacheKey)
    if (alreadySeen) {
      this.logger.warn(`${logPrefix} Apple Pay replay detected`, {
        paymentFlowId,
        transactionIdentifier,
        replayCacheKey,
      })
      throw new BadRequestException(CardErrorCode.ApplePayReplayDetected)
    }

    // Apple Pay PassKit signature verification.
    //
    // Always runs (so we get production traffic to validate against), but
    // only *rejects* on failure when the strict-verify feature flag is on.
    // This lets us soak the verifier in shadow mode — log [APPLEPAY-VERIFY]
    // result=ok|fail without affecting payments — then flip to enforce in
    // ConfigCat once the logs show no false negatives. Fail-safe: if the
    // flag service is unreachable, we default to shadow so a ConfigCat
    // outage can't silently start rejecting payments.
    //
    // See ./applePaySignature.ts for the full algorithm and onTrace events.
    let enforceVerification = false
    try {
      enforceVerification = await this.featureFlagService.getValue(
        Features.isIslandisApplePayStrictSignatureVerificationEnabled,
        false,
      )
    } catch (e) {
      this.logger.error(
        `${logPrefix} [APPLEPAY-VERIFY] feature-flag lookup failed; defaulting to shadow`,
        e,
      )
    }
    const verifyMode = enforceVerification ? 'enforce' : 'shadow'
    try {
      verifyApplePaySignature({
        paymentData: input.paymentData,
        paymentProcessingKey: applePayPaymentProcessingKey,
        onTrace: ({ stage, data }) => {
          this.logger.info(
            `${logPrefix} [APPLEPAY-VERIFY] trace stage=${stage}`,
            {
              paymentFlowId,
              transactionIdentifier,
              mode: verifyMode,
              stage,
              ...data,
            },
          )
        },
      })
      this.logger.info(
        `${logPrefix} [APPLEPAY-VERIFY] result=ok mode=${verifyMode}`,
        {
          paymentFlowId,
          transactionIdentifier,
        },
      )
    } catch (e) {
      const message = (e as Error).message
      const stageMatch = message.match(/\[stage=([^\]]+)\]/)
      const failureStage = stageMatch?.[1] ?? 'unknown'
      this.logger.error(
        `${logPrefix} [APPLEPAY-VERIFY] result=fail mode=${verifyMode}`,
        {
          paymentFlowId,
          transactionIdentifier,
          failureStage,
          failureReason: message,
        },
      )
      if (enforceVerification) {
        throw new BadRequestException(
          CardErrorCode.ApplePaySignatureVerificationFailed,
        )
      }
    }

    let decryptedData: ReturnType<typeof decryptApplePayPaymentToken>
    try {
      decryptedData = decryptApplePayPaymentToken({
        paymentData: input.paymentData,
        paymentProcessingKey: applePayPaymentProcessingKey,
        merchantIdentifier: applePayMerchantIdentifier,
      })
    } catch (e) {
      this.logger.error(`${logPrefix} Apple Pay token decrypt failed`, {
        paymentFlowId,
        error: (e as Error).message,
        merchantIdentifier: applePayMerchantIdentifier,
        tokenVersion: input.paymentData.version,
      })
      throw e
    }

    const { paymentsGatewayApiUrl } = this.config.paymentGateway

    const requestOptions = generateApplePayDecryptedChargeRequestOptions({
      decryptedData,
      paymentApiConfig: this.config.paymentGateway,
      paymentTrackingData,
      amount: totalPrice,
    })

    // Mark the Apple Pay token as consumed BEFORE calling Valitor so a
    // mid-flight failure (response parse error, TLS drop, timeout) can't
    // be retried into a double-charge. The token is consumed at Apple's
    // side regardless of how we handle the response — replay is unsafe.
    // TTL caps the window at one day per Apple Pay token lifetime.
    try {
      await this.cacheManager.set(
        replayCacheKey,
        true,
        Math.max(this.config.memCacheExpiryMinutes, 60 * 24) * 60000,
      )
    } catch (e) {
      // Don't fail the charge on a Redis blip — fall back to today's
      // "no replay protection on this request" behaviour.
      this.logger.error(
        `${logPrefix} Failed to record Apple Pay transactionIdentifier for replay protection (continuing without)`,
        e,
      )
    }

    let response: Response
    try {
      response = await fetch(
        `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
        requestOptions,
      )
    } catch (e) {
      this.logger.error(`${logPrefix} Apple Pay gateway fetch failed`, {
        paymentFlowId,
        gatewayUrl: `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
        error: (e as Error).message,
      })
      throw e
    }

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      paymentFlowId,
      response,
      schema: CardPaymentSuccessSchema,
      errorSchema: CardPaymentErrorSchema,
      errorMessage: 'Failed to charge Apple Pay payment',
    })

    // Replay marker is already set pre-fetch; on success there's nothing
    // more to do here.

    this.logger.info(`${logPrefix} Apple Pay charge succeeded`, {
      paymentFlowId,
      responseCode: data.responseCode,
      responseDescription: data.responseDescription,
      correlationID: data.correlationID,
      acquirerReferenceNumber: data.acquirerReferenceNumber,
      transactionID: data.transactionID,
      authorizationCode: data.authorizationCode,
    })

    return data
  }

  private applePayReplayCacheKey(transactionIdentifier: string): string {
    // Lowercase before keying so case variants of the same Apple Pay
    // transaction id (which is hex) cannot bypass replay detection by
    // hitting different cache slots.
    return `applepay:tx:${transactionIdentifier.toLowerCase()}`
  }

  // REFUND METHODS ------------------------------------------------------------------------------------------------

  // Used when refunding a card payment during Saga rollback
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
        paymentFlowId,
        response,
        schema: RefundSuccessSchema,
        errorSchema: RefundErrorSchema,
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
    TOut extends { isSuccess: true },
    TErrOut extends {
      isSuccess: false
      responseCode: string
      responseDescription?: string
    },
  >({
    response,
    schema,
    errorSchema,
    paymentFlowId,
    errorMessage,
    onErrorBeforeThrow,
  }: {
    response: Response
    schema: z.ZodType<TOut>
    errorSchema: z.ZodType<TErrOut>
    errorMessage: string
    paymentFlowId?: string
    /** Called when !isSuccess, before throwing. Used for refund's INVALID_3D_SECURE_DATA cache cleanup. */
    onErrorBeforeThrow?: (data: TErrOut) => void | Promise<void>
  }): Promise<TOut> {
    const logPrefix = paymentFlowId ? `[${paymentFlowId}] ` : ''

    if (!response.ok) {
      const responseBody = await response.text()

      this.logger.error(errorMessage, {
        statusText: response.statusText,
        responseBody,
      })

      throw new BadRequestException(response.statusText)
    }

    const rawData = await response.json()

    const successParsed = schema.safeParse(rawData)

    if (successParsed.success) {
      return successParsed.data
    }

    const errorParsed = errorSchema.safeParse(rawData)

    if (errorParsed.success) {
      const { responseCode, responseDescription } = errorParsed.data

      try {
        await onErrorBeforeThrow?.(errorParsed.data)
      } catch (cleanupError) {
        this.logger.error(
          `${logPrefix}Failed to run payment gateway error cleanup`,
          cleanupError,
        )
      }
      this.logger.error(`${logPrefix}Payment gateway error: ${errorMessage}`, {
        responseCode,
        responseDescription,
        timestamp: new Date().toISOString(),
      })
      throw new BadRequestException(mapToCardErrorCode(responseCode))
    }

    // if zod schema parsing fails, log the error
    const raw = rawData as Record<string, unknown>
    const responseCode = raw?.responseCode
    const responseDescription = raw?.responseDescription

    this.logger.error(`${logPrefix}Failed to parse payment gateway response`, {
      responseCode,
      responseDescription,
      timestamp: new Date().toISOString(),
      parseError: successParsed.error,
    })

    throw new BadRequestException('Failed to parse payment gateway response')
  }
}
