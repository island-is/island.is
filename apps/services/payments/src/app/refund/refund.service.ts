import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { z } from 'zod'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  PaymentTrackingData,
  RefundResponseSchema,
  RefundSuccessResponse,
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
  }: {
    paymentTrackingData: PaymentTrackingData
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
      schema: RefundResponseSchema,
      errorMessage: 'Failed to refund payment with correlation id',
    })

    return data as RefundSuccessResponse
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
        originalTransactionDate:
          paymentTrackingData.paymentDate.toISOString(),
        systemCalling,
      }),
    }
  }

  private async parseGatewayResponse<T extends z.ZodTypeAny>({
    response,
    schema,
    errorMessage,
  }: {
    response: Response
    schema: T
    errorMessage: string
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
      this.logger.error(`Payment gateway error: ${errorMessage}`, {
        responseCode,
        responseDescription,
      })
      throw new BadRequestException(mapToCardErrorCode(responseCode))
    }

    return parsedData.data
  }
}
