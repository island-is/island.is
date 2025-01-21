import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
// import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { ConfigType } from '@nestjs/config'
import { ChargeResponse, VerificationResponse } from './cardPayment.types'
import {
  generateChargeRequestOptions,
  generateMd,
  generateVerificationRequestOptions,
  getPayloadFromMd,
} from './cardPayment.utils'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { getTempStorage } from '../tempInMemoryStorage'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'

interface SavedVerificationData {
  paymentFlowId: string
  amount: number
}

@Injectable()
export class CardPaymentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    // private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @Inject(CardPaymentModuleConfig.KEY)
    private readonly config: ConfigType<typeof CardPaymentModuleConfig>,
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

    const { amount, correlationId, paymentFlowId } = verifyCardInput

    const md = generateMd({
      correlationId,
      paymentFlowId,
      amount,
      paymentsTokenSigningSecret,
      paymentsTokenSigningAlgorithm,
      paymentsTokenSignaturePrefix,
    })

    // TODO associate correlationId with payment flow
    getTempStorage().set(
      verifyCardInput.correlationId,
      {
        paymentFlowId: verifyCardInput.paymentFlowId,
        amount,
      } as SavedVerificationData,
      memCacheExpiryMinutes * 60,
    ) // Valid for 60 seconds

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
      // TODO: map error to correct client error
      this.logger.error('Failed to verify card', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        responseBody,
      })
      throw new Error(response.statusText)
    }

    const data = (await response.json()) as VerificationResponse

    return data
  }

  async verifyThreeDSecureCallback({
    md,
    cavv,
    dsTransId,
    mdStatus,
    xid,
  }: VerificationCallbackInput) {
    let success = false

    const {
      tokenExpiryMinutes,
      memCacheExpiryMinutes,
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

    const { correlationId, paymentFlowId, amount, issuedAt } = payload

    const now = Date.now()
    const tokenExpiresAt = (issuedAt + tokenExpiryMinutes * 60) * 1000

    if (now > tokenExpiresAt) {
      this.logger.error('Token was expired', correlationId)
    }

    const storedValue = getTempStorage().getAndDelete(
      correlationId,
    ) as SavedVerificationData

    if (!storedValue) {
      this.logger.error(
        'No stored value found for correlationId',
        correlationId,
      )
    }

    if (
      storedValue.amount === amount &&
      storedValue.paymentFlowId === paymentFlowId
    ) {
      success = true

      // Save verified information to payment flow
      // to allow client (polling) to continue with payment using verification data
      getTempStorage().set(
        correlationId,
        {
          cavv,
          mdStatus,
          xid,
          dsTransId,
        },
        memCacheExpiryMinutes * 60,
      ) // Valid for 60 seconds
    } else {
      this.logger.error('Stored value does not match payload', {
        storedAmount: storedValue.amount,
        payloadAmount: amount,
      })
    }

    return {
      success,
      paymentFlowId,
    }
  }

  async charge(chargeCardInput: ChargeCardInput) {
    let success = false

    const { correlationId } = chargeCardInput

    const verificationData = getTempStorage().get(correlationId)

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
    }

    const data = (await response.json()) as ChargeResponse

    return data
  }
}
