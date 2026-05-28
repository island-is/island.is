import { z } from 'zod'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Charge } from '@island.is/clients/charge-fjs-v2'
import { BankTransferErrorCode } from '@island.is/shared/constants'

import { PaymentMethod } from '../../types'
import { environment } from '../../environments'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  BankTransferPaymentResult,
  CreateBankTransferPaymentInput,
  blikkCreatePaymentResponseSchema,
  blikkGetPaymentResponseSchema,
} from './bankTransfer.types'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferPayment } from './models/bankTransferPayment.model'
import {
  generateBankTransferChargeFJSPayload,
  isBlikkStatus,
  mapBlikkStatusToBankTransferStatus,
  toBlikkItem,
} from './bankTransfer.utils'

const REQUEST_TIMEOUT_MS = 10000

const createLogPrefix = (
  paymentFlowId: string,
  correlationId: string,
  providerPaymentId: string,
) =>
  `[${paymentFlowId}][correlationId: ${correlationId}][rrn: ${providerPaymentId}]`

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
    @InjectModel(BankTransferPayment)
    private readonly bankTransferPaymentModel: typeof BankTransferPayment,
    private readonly paymentFlowService: PaymentFlowService,
  ) {}

  async createPayment(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const body = {
      amount: input.amount,
      currency: input.currency,
      sourceReferenceId: input.correlationId,
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

    const logPrefix = createLogPrefix(
      input.paymentFlowId,
      input.correlationId,
      data.id,
    )

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

  /**
   * Confirms a settled bank transfer. Called once the provider reports terminal SUCCESS.
   *
   * Idempotent: (1) record the provider's status on our own row; (2) build the FJS charge payload;
   * (3) delegate to {@link PaymentFlowService.createBankTransferFulfillment}, which no-ops if the flow is
   * already fulfilled and creates the FJS charge only on the first payment; (4) notify upstream.
   * Concurrency is handled inside `createBankTransferFulfillment` (the partial unique index gates the
   * single FJS charge); the success notification is idempotent on the consumer side.
   */
  async confirmBankTransferPayment({
    correlationId,
    paymentFlowId,
    providerPaymentId,
    rawStatus,
  }: {
    /**
     * The per-attempt UUID we generated when creating this bank transfer — equal to
     * `bank_transfer_payment.id` and to the value we sent to Blikk as `sourceReferenceId`. NOT the
     * provider's own `providerPaymentId`.
     */
    correlationId: string
    paymentFlowId: string
    providerPaymentId: string
    rawStatus: string
  }): Promise<void> {
    // 1. Record the provider's terminal status on our own row (idempotent).
    await this.bankTransferPaymentModel.update(
      { lastKnownStatus: rawStatus },
      { where: { id: correlationId, paymentFlowId, isDeleted: false } },
    )

    // 2. Build the FJS charge payload.
    const chargePayload = await this.buildFjsChargePayload(
      paymentFlowId,
      providerPaymentId,
    )

    // 3. Create the fulfillment and, only on the first payment, the FJS charge.
    await this.paymentFlowService.createBankTransferFulfillment(
      paymentFlowId,
      correlationId,
      chargePayload,
    )

    // 4. Notify upstream of the completed payment.
    await this.paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'payment_completed',
        message: 'Bank transfer payment completed',
        metadata: { providerPaymentId },
      },
      { useRetry: true, throwOnError: false },
    )
  }

  /**
   * Builds the FJS charge payload for a settled bank transfer.
   */
  private async buildFjsChargePayload(
    paymentFlowId: string,
    providerPaymentId: string,
  ): Promise<Charge> {
    const paymentFlow = await this.paymentFlowService.getPaymentFlowDetails(
      paymentFlowId,
    )
    const { catalogItems, totalPrice } =
      await this.paymentFlowService.getPaymentFlowChargeDetails(
        paymentFlow.organisationId,
        paymentFlow.charges,
      )

    return generateBankTransferChargeFJSPayload({
      paymentFlow,
      charges: catalogItems,
      totalPrice,
      systemId: environment.chargeFjs.systemId,
      providerPaymentId,
    })
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
