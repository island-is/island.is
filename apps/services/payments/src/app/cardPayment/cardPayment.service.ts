import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'
import { ConfigType } from '@nestjs/config'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
// import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { CardPaymentModuleConfig } from './cardPayment.config'
import {
  CachePaymentFlowStatus,
  ChargeResponse,
  MdNormalised,
  SavedVerificationCompleteData,
  SavedVerificationPendingData,
  VerificationResponse,
} from './cardPayment.types'
import {
  generateChargeRequestOptions,
  generateMd,
  generateVerificationRequestOptions,
  getPayloadFromMd,
  mapToCardErrorCode,
} from './cardPayment.utils'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'

@Injectable()
export class CardPaymentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    // private chargeFjsV2ClientService: ChargeFjsV2ClientService,
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
        paymentsTokenSignaturePrefix,
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
      paymentsTokenSignaturePrefix,
    })

    await this.cacheManager.set(
      correlationId,
      {
        paymentFlowId: verifyCardInput.paymentFlowId,
        amount,
      } as SavedVerificationPendingData,
      memCacheExpiryMinutes * 60000,
    )

    const requestOptions = generateVerificationRequestOptions({
      verifyCardInput,
      paymentApiConfig: this.config.paymentGateway,
      md: md,
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
      throw new Error(response.statusText)
    }

    const data = (await response.json()) as VerificationResponse

    if (!data?.isSuccess) {
      throw new Error(mapToCardErrorCode(data.responseCode))
    }

    return data
  }

  getMdPayload(md: string): MdNormalised {
    try {
      const {
        paymentGateway: {
          paymentsTokenSigningSecret,
          paymentsTokenSignaturePrefix,
        },
      } = this.config

      const payload = getPayloadFromMd({
        md,
        paymentsTokenSigningSecret,
        paymentsTokenSignaturePrefix,
      })

      return payload
    } catch (e) {
      this.logger.error('Failed to get payload from md', e)
      throw new Error('Invalid md object')
    }
  }

  async verifyThreeDSecureCallback({
    cardVerificationCallbackInput: { cavv, mdStatus, xid, dsTransId },
    mdPayload,
  }: {
    cardVerificationCallbackInput: VerificationCallbackInput
    mdPayload: MdNormalised
  }) {
    let success = false

    const { tokenExpiryMinutes, memCacheExpiryMinutes } = this.config

    const { correlationId, paymentFlowId, amount, issuedAt } = mdPayload

    const now = Date.now()
    const tokenExpiresAt = (issuedAt + tokenExpiryMinutes * 60) * 1000

    if (now > tokenExpiresAt) {
      this.logger.error('Token was expired', correlationId)
      throw new BadRequestException('Invalid token')
    }

    const storedValue = (await this.cacheManager.get(
      correlationId,
    )) as SavedVerificationPendingData

    if (!storedValue) {
      this.logger.error(
        'No stored value found for correlationId',
        correlationId,
      )
      throw new BadRequestException('Invalid token')
    }

    await this.cacheManager.del(correlationId)

    if (
      storedValue?.amount === amount &&
      storedValue?.paymentFlowId === paymentFlowId
    ) {
      success = true

      // Save verified information to payment flow
      // to allow client (polling) to continue with payment using verification data
      await this.cacheManager.set(
        correlationId,
        {
          cavv,
          mdStatus,
          xid,
          dsTransId,
        },
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
    } else {
      this.logger.error('Stored value does not match payload', {
        storedAmount: storedValue?.amount,
        payloadAmount: amount,
      })
      throw new BadRequestException('Invalid token')
    }

    return {
      success,
      paymentFlowId,
    }
  }

  private async getFullVerificationStatus(paymentFlowId: string) {
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

  async charge(chargeCardInput: ChargeCardInput) {
    const status = await this.getFullVerificationStatus(
      chargeCardInput.paymentFlowId,
    )

    if (!status?.isVerified || !status?.correlationId) {
      throw new Error('Verification data not found')
    }

    const { correlationId } = status

    const verificationData = (await this.cacheManager.get(
      correlationId,
    )) as SavedVerificationCompleteData

    if (!verificationData) {
      throw new Error('Verification data not found')
    }

    if (
      !verificationData.cavv ||
      !verificationData.mdStatus ||
      !verificationData.xid ||
      !verificationData.dsTransId
    ) {
      throw new Error('Verification data not found')
    }

    const {
      paymentGateway: { paymentsGatewayApiUrl },
    } = this.config

    const requestOptions = generateChargeRequestOptions({
      chargeCardInput,
      verificationData,
      paymentApiConfig: this.config.paymentGateway,
    })

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/CardPayment`,
      requestOptions,
    )

    if (!response.ok) {
      const responseBody = await response.text()
      this.logger.error('Failed to charge card', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        responseBody,
      })
      throw new Error(response.statusText)
    }

    const data = (await response.json()) as ChargeResponse

    if (!data?.isSuccess) {
      throw new Error(mapToCardErrorCode(data.responseCode))
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
}
