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
import {
  decryptApplePayPaymentToken,
  generateApplePayDecryptedChargeRequestOptions,
  generateApplePayValidationRequestOptions,
  generateChargeRequestOptions,
  generateMd,
  generateRefundRequestOptions,
  generateVerificationRequestOptions,
  getPayloadFromMd,
  redactCardNumber,
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
    // DEBUG-APPLEPAY: extra logging for prod-only Apple Pay validation; remove after rollout
    this.logger.info('[DEBUG-APPLEPAY] Merchant validation started', {
      validationURL,
    })

    const {
      applePayMerchantIdentifier,
      applePayMerchantIdentityCert,
      applePayMerchantIdentityKey,
      applePayDomainName,
      applePayDisplayName,
    } = this.requireMerchantIdentityConfig()

    // DEBUG-APPLEPAY: PEM header lines + lengths help diagnose env-var injection bugs (literal `\n` vs real newlines, wrong cert pasted, etc.)
    this.logger.info('[DEBUG-APPLEPAY] Merchant validation config resolved', {
      merchantIdentifier: applePayMerchantIdentifier,
      displayName: applePayDisplayName,
      initiativeContext: applePayDomainName,
      certLength: applePayMerchantIdentityCert.length,
      certHeader: applePayMerchantIdentityCert.split('\n')[0],
      keyLength: applePayMerchantIdentityKey.length,
      keyHeader: applePayMerchantIdentityKey.split('\n')[0],
      agentAlreadyMemoized: this.applePayMerchantAgent !== null,
    })

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
      // DEBUG-APPLEPAY: fetch-level failures (mTLS handshake, DNS, network) never reach the !response.ok branch
      this.logger.error(
        '[DEBUG-APPLEPAY] Merchant validation fetch threw before response',
        {
          validationURL,
          error: (e as Error).message,
          stack: (e as Error).stack,
        },
      )
      throw e
    }

    if (!response.ok) {
      const responseBody = await response.text()
      this.logger.error(
        '[DEBUG-APPLEPAY] Merchant validation non-OK response',
        {
          validationURL,
          status: response.status,
          statusText: response.statusText,
          responseBody,
        },
      )
      throw new BadRequestException(
        `Apple Pay validation failed: ${response.status} ${responseBody}`,
      )
    }

    const data = await response.json()
    const session = JSON.stringify(data)

    // DEBUG-APPLEPAY: capture session prefix so we can correlate with Apple's logs without leaking the full session blob
    this.logger.info('[DEBUG-APPLEPAY] Merchant validation succeeded', {
      validationURL,
      sessionLength: session.length,
      sessionPrefix: session.slice(0, 64),
    })

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

    // DEBUG-APPLEPAY: extra logging for prod-only Apple Pay charge; remove after rollout
    this.logger.info(`${logPrefix} [DEBUG-APPLEPAY] Charge started`, {
      paymentFlowId,
      totalPrice,
      tokenVersion: input.paymentData.version,
      transactionIdentifier,
      correlationId: paymentTrackingData.correlationId,
      merchantReferenceData: paymentTrackingData.merchantReferenceData,
    })

    const { applePayPaymentProcessingKey, applePayMerchantIdentifier } =
      this.requireApplePayDecryptionConfig()

    // DEBUG-APPLEPAY: PEM header + length helps diagnose missing newlines / wrong key paste in env vars
    this.logger.info(
      `${logPrefix} [DEBUG-APPLEPAY] Decryption config resolved`,
      {
        paymentFlowId,
        merchantIdentifier: applePayMerchantIdentifier,
        processingKeyLength: applePayPaymentProcessingKey.length,
        processingKeyHeader: applePayPaymentProcessingKey.split('\n')[0],
        processingKeyAlreadyValidated: this.applePayProcessingKeyValidated,
      },
    )

    try {
      this.validateApplePayProcessingKeyOnce(applePayPaymentProcessingKey)
    } catch (e) {
      this.logger.error(
        `${logPrefix} [DEBUG-APPLEPAY] Processing key PEM failed to parse`,
        {
          paymentFlowId,
          error: (e as Error).message,
          processingKeyLength: applePayPaymentProcessingKey.length,
          processingKeyHeader: applePayPaymentProcessingKey.split('\n')[0],
        },
      )
      throw e
    }

    // Reject replay of a previously seen Apple Pay token.
    const replayCacheKey = this.applePayReplayCacheKey(transactionIdentifier)
    const alreadySeen = await this.cacheManager.get(replayCacheKey)
    if (alreadySeen) {
      this.logger.warn(`${logPrefix} [DEBUG-APPLEPAY] Replay detected`, {
        paymentFlowId,
        transactionIdentifier,
        replayCacheKey,
      })
      throw new BadRequestException(CardErrorCode.ApplePayReplayDetected)
    }

    // TODO(apple-pay-signature-verify): verify paymentData.signature (CMS),
    // chain to Apple Root CA G3, leaf OID 1.2.840.113635.100.6.29, signing
    // time within ~5 min, and header.publicKeyHash matches our payment
    // processing public key SPKI. Endpoint is gated by
    // Features.isIslandisApplePayPaymentEnabled while this is outstanding.

    // DEBUG-APPLEPAY: capture token shape pre-decrypt to attribute decrypt failures to malformed input vs key/KDF mismatch
    this.logger.info(`${logPrefix} [DEBUG-APPLEPAY] Token pre-decrypt`, {
      paymentFlowId,
      version: input.paymentData.version,
      dataLength: input.paymentData.data?.length ?? 0,
      signatureLength: input.paymentData.signature?.length ?? 0,
      ephemeralPublicKeyLength:
        input.paymentData.header?.ephemeralPublicKey?.length ?? 0,
      publicKeyHashLength: input.paymentData.header?.publicKeyHash?.length ?? 0,
      hasTransactionId: !!input.paymentData.header?.transactionId,
    })

    let decryptedData: ReturnType<typeof decryptApplePayPaymentToken>
    try {
      decryptedData = decryptApplePayPaymentToken({
        paymentData: input.paymentData,
        paymentProcessingKey: applePayPaymentProcessingKey,
        merchantIdentifier: applePayMerchantIdentifier,
      })
    } catch (e) {
      // DEBUG-APPLEPAY: most likely culprits are KDF Party V mismatch (wrong merchantIdentifier),
      // wrong processing key, or malformed ephemeral SPKI / GCM auth-tag mismatch
      this.logger.error(`${logPrefix} [DEBUG-APPLEPAY] Token decrypt failed`, {
        paymentFlowId,
        error: (e as Error).message,
        stack: (e as Error).stack,
        merchantIdentifier: applePayMerchantIdentifier,
        tokenVersion: input.paymentData.version,
        dataLength: input.paymentData.data?.length ?? 0,
        ephemeralPublicKeyLength:
          input.paymentData.header?.ephemeralPublicKey?.length ?? 0,
      })
      throw e
    }

    // DEBUG-APPLEPAY: confirms decrypt produced sensible fields before we forward to Valitor
    this.logger.info(`${logPrefix} [DEBUG-APPLEPAY] Token decrypted`, {
      paymentFlowId,
      maskedCardNumber: redactCardNumber(decryptedData.cardNumber),
      cardNumberLength: decryptedData.cardNumber.length,
      expirationMonth: decryptedData.expirationMonth,
      expirationYear: decryptedData.expirationYear,
      cryptogramLength: decryptedData.paymentCryptogram.length,
    })

    const { paymentsGatewayApiUrl } = this.config.paymentGateway

    const requestOptions = generateApplePayDecryptedChargeRequestOptions({
      decryptedData,
      paymentApiConfig: this.config.paymentGateway,
      paymentTrackingData,
      amount: totalPrice,
    })

    // DEBUG-APPLEPAY: log the gateway request shape so we can verify the payload matches Valitor's WalletPayment spec
    this.logger.info(`${logPrefix} [DEBUG-APPLEPAY] Gateway request prepared`, {
      paymentFlowId,
      gatewayUrl: `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
      maskedCardNumber: redactCardNumber(decryptedData.cardNumber),
      amount: totalPrice,
      correlationId: paymentTrackingData.correlationId,
      merchantReferenceData: paymentTrackingData.merchantReferenceData,
      bodyLength:
        typeof requestOptions.body === 'string'
          ? requestOptions.body.length
          : 0,
    })

    let response: Response
    try {
      response = await fetch(
        `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
        requestOptions,
      )
    } catch (e) {
      // DEBUG-APPLEPAY: gateway DNS / TLS / network errors surface here, never reach response.ok
      this.logger.error(
        `${logPrefix} [DEBUG-APPLEPAY] Gateway fetch threw before response`,
        {
          paymentFlowId,
          gatewayUrl: `${paymentsGatewayApiUrl}/Payment/WalletPayment`,
          error: (e as Error).message,
          stack: (e as Error).stack,
        },
      )
      throw e
    }

    // DEBUG-APPLEPAY: cheap signal for "did Valitor even acknowledge" before we try to parse
    this.logger.info(
      `${logPrefix} [DEBUG-APPLEPAY] Gateway response received`,
      {
        paymentFlowId,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
    )

    const data = await this.parsePaymentGatewayResponseAndHandleErrors({
      paymentFlowId,
      response,
      schema: CardPaymentSuccessSchema,
      errorSchema: CardPaymentErrorSchema,
      errorMessage: 'Failed to charge Apple Pay payment',
    })

    // Mark the Apple Pay token as consumed so a replay is rejected.
    // Set after Valitor confirms success so a gateway error lets the user
    // retry. TTL caps the window at one day per Apple Pay token lifetime.
    try {
      await this.cacheManager.set(
        replayCacheKey,
        true,
        Math.max(this.config.memCacheExpiryMinutes, 60 * 24) * 60000,
      )
    } catch (e) {
      this.logger.error(
        `${logPrefix} Failed to record Apple Pay transactionIdentifier for replay protection`,
        e,
      )
    }

    this.logger.info(`${logPrefix} [DEBUG-APPLEPAY] Charge succeeded`, {
      paymentFlowId,
      maskedCardNumber: redactCardNumber(decryptedData.cardNumber),
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
    return `applepay:tx:${transactionIdentifier}`
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
