import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { z } from 'zod'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  PaymentTrackingData,
  RefundErrorSchema,
  RefundSuccessResponse,
  RefundSuccessSchema,
} from '../../types/cardPayment'
import { mapToCardErrorCode } from '../../utils/paymentErrors'
import { RefundModuleConfig, RefundModuleConfigType } from './refund.config'

@Injectable()
export class RefundService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(RefundModuleConfig.KEY)
    private readonly config: ConfigType<typeof RefundModuleConfig>,
  ) {}

  async refundWithCorrelationId({
    paymentTrackingData,
    paymentFlowId,
  }: {
    paymentTrackingData: PaymentTrackingData
    paymentFlowId?: string
  }): Promise<RefundSuccessResponse> {
    const { paymentsGatewayApiUrl } = this.config.paymentGateway

    const requestOptions = this.buildRefundWithCorrelationIdRequest(
      this.config.paymentGateway,
      paymentTrackingData,
    )

    const response = await fetch(
      `${paymentsGatewayApiUrl}/Payment/RefundWithCorrelationId`,
      requestOptions,
    )

    const data = await this.parseGatewayResponse({
      response,
      schema: RefundSuccessSchema,
      errorSchema: RefundErrorSchema,
      errorMessage: 'Failed to refund payment with correlation id',
      paymentFlowId,
    })

    return data
  }

  private buildRefundWithCorrelationIdRequest(
    gatewayConfig: RefundModuleConfigType['paymentGateway'],
    paymentTrackingData: PaymentTrackingData,
  ): RequestInit {
    const {
      paymentsApiSecret,
      paymentsApiHeaderKey,
      paymentsApiHeaderValue,
      systemCalling,
    } = gatewayConfig

    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: paymentsApiSecret,
        [paymentsApiHeaderKey]: paymentsApiHeaderValue,
      },
      body: JSON.stringify({
        originalCorrelationId: paymentTrackingData.correlationId,
        originalTransactionDate: paymentTrackingData.paymentDate.toISOString(),
        systemCalling,
      }),
    }
  }

  private async parseGatewayResponse<
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
    errorMessage,
    paymentFlowId,
  }: {
    response: Response
    schema: z.ZodType<TOut>
    errorSchema: z.ZodType<TErrOut>
    errorMessage: string
    paymentFlowId?: string
  }): Promise<TOut> {
    const logPrefix = paymentFlowId ? `[${paymentFlowId}] ` : ''

    if (!response.ok) {
      const responseBody = await response.text()

      this.logger.error(`${logPrefix}${errorMessage}`, {
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
      this.logger.error(`${logPrefix}Payment gateway error: ${errorMessage}`, {
        responseCode,
        responseDescription,
      })
      throw new BadRequestException(mapToCardErrorCode(responseCode))
    }

    this.logger.error(`${logPrefix}Failed to parse payment gateway response`, {
      error: successParsed.error,
    })
    throw new BadRequestException('Failed to parse payment gateway response')
  }
}
