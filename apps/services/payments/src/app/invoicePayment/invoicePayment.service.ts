import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { sign, verify, Algorithm } from 'jsonwebtoken'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { InvoicePaymentModuleConfig } from './invoicePayment.config'
import { CallbackInput } from './dtos/callback.input'

@Injectable()
export class InvoicePaymentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(InvoicePaymentModuleConfig.KEY)
    private readonly config: ConfigType<typeof InvoicePaymentModuleConfig>,
  ) {}

  private createCallbackToken(paymentFlowId: string) {
    // Reduce token size
    const payload = {
      p: paymentFlowId,
      i: Math.floor(Date.now() / 1000),
    }

    const token = sign(payload, this.config.tokenSigningSecret, {
      algorithm: this.config.tokenSigningAlgorithm as Algorithm,
      noTimestamp: true, // Don't add 'iat' automatically to reduce token size
    })
    return token
  }

  async createCallbackUrl(paymentFlowId: string) {
    return `${
      this.config.callbackBaseUrl
    }/v1/payments/invoice/callback?token=${this.createCallbackToken(
      paymentFlowId,
    )}`
  }

  private validateCallbackToken(token: string): {
    paymentFlowId: string
    issuedAt: number
  } {
    if (!token) {
      throw new BadRequestException('Token is required')
    }

    try {
      let payload: { p: string; i: number }
      try {
        payload = verify(token, this.config.tokenSigningSecret) as {
          p: string
          i: number
        }
      } catch (error) {
        // If current secret fails we try the previous secret
        if (this.config.previousTokenSigningSecret) {
          this.logger.info(
            'Token validation failed with current secret, trying previous secret',
          )
          payload = verify(token, this.config.previousTokenSigningSecret) as {
            p: string
            i: number
          }
        } else {
          throw error
        }
      }

      const now = Math.floor(Date.now() / 1000)
      const tokenExpiresAt = payload.i + this.config.tokenExpiryMinutes * 60

      if (now > tokenExpiresAt) {
        // Tokens will not be considered expired for now
        // this.logger.error('Invoice callback token was expired', {
        //   paymentFlowId: payload.p,
        //   issuedAt: payload.i,
        //   expiresAt: tokenExpiresAt,
        // })
        // throw new BadRequestException('Token has expired')
      }

      return {
        paymentFlowId: payload.p,
        issuedAt: payload.i,
      }
    } catch (error) {
      this.logger.error('Invalid invoice callback token', {
        error: error.message,
      })
      throw new BadRequestException('Invalid token')
    }
  }

  async validateCallback(callbackInput: CallbackInput, token: string) {
    const tokenPayload = this.validateCallbackToken(token)

    this.logger.info(
      `[${tokenPayload.paymentFlowId}] Invoice payment callback received`,
      {
        receptionID: callbackInput.receptionID,
        chargeItemSubject: callbackInput.chargeItemSubject,
        status: callbackInput.status,
        paymentFlowId: tokenPayload.paymentFlowId,
      },
    )

    return {
      isSuccess: true,
      message: 'Callback processed successfully',
      paymentFlowId: tokenPayload.paymentFlowId,
    }
  }
}
