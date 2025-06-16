import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'
import { ConfigType } from '@nestjs/config'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'

import { CardPaymentModuleConfig } from './cardPayment.config'
import {
  CachePaymentFlowStatus,
  ChargeResponse,
  MdNormalised,
  RefundResponse,
  SavedVerificationCompleteData,
  SavedVerificationPendingData,
  VerificationResponse,
} from './cardPayment.types'
import {
  generateCardChargeFJSPayload,
  generateChargeRequestOptions,
  generateMd,
  generateRefundRequestOptions,
  generateVerificationRequestOptions,
  getPayloadFromMd,
  mapToCardErrorCode,
} from './cardPayment.utils'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CatalogItemWithQuantity } from '../../types/charges'
import { PaymentTrackingData } from '../../types/cardPayment'
import { paymentGatewayResponseCodes } from './cardPayment.constants'

@Injectable()
export class CardPaymentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CardPaymentModuleConfig.KEY)
    private readonly config: ConfigType<typeof CardPaymentModuleConfig>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
  ) {}

  async verify(
    verifyCardInput: VerifyCardInput,
  ): Promise<VerificationResponse> {
    const {
      memCacheExpiryMinutes,
      paymentGateway: {
        paymentsTokenSigningSecret,
        paymentsTokenSigningAlgorithm,
        paymentsGatewayApiUrl,
      },
    } = this.config

    const correlationId = uuid()

    const { amount, paymentFlowId } = verifyCardInput

    const md = generateMd({
      correlationId,
      paymentFlowId,
      amount,
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
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/CardVerification`,
      requestOptions,
    )

    if (!response.ok) {
      const responseBody = await response.text()
      this.logger.error('Failed to verify card', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        responseBody,
      })
      throw new BadRequestException(response.statusText)
    }

    const data = (await response.json()) as VerificationResponse

    if (!data?.isSuccess) {
      this.logger.error(`Failed to verify card (${paymentFlowId})`, {
        url: response.url,
        responseCode: data.responseCode,
        responseDescription: data.responseDescription,
      })
      throw new BadRequestException(mapToCardErrorCode(data.responseCode))
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

  async charge(
    chargeCardInput: ChargeCardInput,
    paymentTrackingData: PaymentTrackingData,
  ) {
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
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/CardPayment`,
      requestOptions,
    )

    if (!response.ok) {
      const responseBody = await response.text()
      this.logger.error('Failed to charge card', {
        statusText: response.statusText,
        responseBody,
      })
      throw new BadRequestException(response.statusText)
    }

    const data = (await response.json()) as ChargeResponse

    if (!data?.isSuccess) {
      this.logger.error('Failed to charge card', {
        responseCode: data?.responseCode,
        responseDescription: data?.responseDescription,
      })
      throw new BadRequestException(mapToCardErrorCode(data.responseCode))
    }

    try {
      await this.cacheManager.del(correlationId)
      await this.cacheManager.del(chargeCardInput.paymentFlowId)
    } catch (e) {
      this.logger.error(
        'Failed to clear cache after a successful card payment',
        e,
      )
    }

    return data
  }

  async refund(
    paymentFlowId: string,
    cardNumber: string,
    charge: ChargeResponse,
    amount: number,
  ) {
    try {
      const requestOptions = generateRefundRequestOptions({
        amount,
        cardNumber,
        charge,
        paymentApiConfig: this.config.paymentGateway,
      })

      const {
        paymentGateway: { paymentsGatewayApiUrl },
      } = this.config

      const response = await fetch(
        `${paymentsGatewayApiUrl}/Payment/CardPayment`,
        requestOptions,
      )

      if (!response.ok) {
        const responseBody = await response.text()
        this.logger.error(`[${paymentFlowId}] Failed to refund payment`, {
          statusText: response.statusText,
          responseBody,
        })
        throw new BadRequestException(response.statusText)
      }

      const data = (await response.json()) as RefundResponse

      if (!data?.isSuccess) {
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

        this.logger.error(`[${paymentFlowId}] Failed to refund payment`, {
          responseCode: data?.responseCode,
          responseDescription: data?.responseDescription,
          correlationId: data?.correlationId,
        })
        throw new BadRequestException(mapToCardErrorCode(data.responseCode))
      }

      return data
    } catch (e) {
      this.logger.error(`[${paymentFlowId}] Failed to refund payment`, e)
      throw e
    }
  }

  createCardPaymentChargePayload({
    paymentFlow,
    charges,
    chargeResponse,
    totalPrice,
    merchantReferenceData,
    systemId,
  }: {
    paymentFlow: PaymentFlowAttributes
    charges: CatalogItemWithQuantity[]
    chargeResponse: ChargeResponse
    totalPrice: number
    merchantReferenceData: string
    systemId: string
  }) {
    return generateCardChargeFJSPayload({
      paymentFlow,
      charges,
      chargeResponse,
      totalPrice,
      systemId,
      merchantReferenceData,
    })
  }
}
