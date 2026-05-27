import { z } from 'zod'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BankTransferErrorCode } from '@island.is/shared/constants'

import {
  BankTransferPaymentResult,
  CreateBankTransferPaymentInput,
  blikkCreatePaymentResponseSchema,
  blikkGetPaymentResponseSchema,
} from './bankTransfer.types'
import { BankTransferModuleConfig } from './bankTransfer.config'
import {
  isBlikkStatus,
  mapBlikkStatusToBankTransferStatus,
  toBlikkItem,
} from './bankTransfer.utils'

const REQUEST_TIMEOUT_MS = 10000

/**
 * Service for the bank-transfer payment method (Blikk is the v1 provider).
 *
 * Wraps the provider HTTP API (Blikk ECom v3: `POST /ecom/v3/payments`, `GET /ecom/v3/payments/:id`)
 * and returns normalized {@link BankTransferPaymentResult}s so callers stay provider-agnostic.
 * The verify/confirm domain logic is added in later steps.
 */
@Injectable()
export class BankTransferService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(BankTransferModuleConfig.KEY)
    private readonly config: ConfigType<typeof BankTransferModuleConfig>,
  ) {}

  async createPayment(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const logPrefix = `[${input.paymentFlowId}] `

    const body = {
      amount: input.amount,
      currency: input.currency,
      sourceReferenceId: input.paymentFlowId,
      callbackUrl: input.callbackUrl,
      partnerRedirectUrl: input.partnerRedirectUrl,
      source: input.source,
      expiresAt: input.expiresAt,
      items: input.items?.map(toBlikkItem),
    }

    const data = await this.request(
      'POST',
      '/ecom/v3/payments',
      blikkCreatePaymentResponseSchema,
      BankTransferErrorCode.FailedToCreateBankTransfer,
      input.paymentFlowId,
      body,
    )

    const result = this.toResult(data)

    this.logger.info(`${logPrefix}Bank transfer payment created`, {
      paymentFlowId: input.paymentFlowId,
      status: result.status,
    })

    return result
  }

  async getPayment(
    providerPaymentId: string,
  ): Promise<BankTransferPaymentResult> {
    const data = await this.request(
      'GET',
      `/ecom/v3/payments/${encodeURIComponent(providerPaymentId)}`,
      blikkGetPaymentResponseSchema,
      BankTransferErrorCode.FailedToFetchBankTransfer,
      providerPaymentId,
    )

    return this.toResult(data)
  }

  private toResult(data: {
    id: string
    status: string
    scaRedirectUrl?: string
    message?: string
  }): BankTransferPaymentResult {
    if (!isBlikkStatus(data.status)) {
      this.logger.warn(`[${data.id}] Unknown bank transfer status received`, {
        status: data.status,
      })
    }

    return {
      providerPaymentId: data.id,
      rawStatus: data.status,
      status: mapBlikkStatusToBankTransferStatus(data.status),
      // Empty string means back-channel SCA (no redirect) — surface as undefined.
      scaRedirectUrl: data.scaRedirectUrl || undefined,
      message: data.message || undefined,
    }
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    schema: z.ZodType<T>,
    errorCode: BankTransferErrorCode,
    logRef: string,
    body?: unknown,
  ): Promise<T> {
    const logPrefix = logRef ? `[${logRef}] ` : ''
    const url = `${this.config.baseUrl}${path}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })
    } catch (e) {
      this.logger.error(`${logPrefix}Bank transfer request failed`, {
        method,
        path,
        error: e?.message,
        timestamp: new Date().toISOString(),
      })
      throw new BadRequestException(errorCode)
    } finally {
      clearTimeout(timeout)
    }

    let responseBody: unknown
    try {
      responseBody = await response.json()
    } catch {
      responseBody = undefined
    }

    if (!response.ok) {
      this.logger.error(
        `${logPrefix}Bank transfer returned an error response`,
        {
          method,
          path,
          status: response.status,
          statusText: response.statusText,
          responseBody,
        },
      )
      throw new BadRequestException(errorCode)
    }

    const parsed = schema.safeParse(responseBody)
    if (!parsed.success) {
      this.logger.error(`${logPrefix}Failed to parse bank transfer response`, {
        method,
        path,
        parseError: parsed.error,
        timestamp: new Date().toISOString(),
      })
      throw new BadRequestException(errorCode)
    }

    return parsed.data
  }
}
