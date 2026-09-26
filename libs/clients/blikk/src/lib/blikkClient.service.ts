import { Injectable } from '@nestjs/common'

import { FetchError } from '@island.is/clients/middlewares'

import {
  cancelPayment,
  createDirectDebtorPayment,
  getPayment,
} from '../../gen/fetch'
import type {
  CreateDirectDebtorPaymentBody,
  CreateDirectDebtorPaymentReqBody,
  ErrorModel,
  GetPaymentOutputBody,
} from '../../gen/fetch'
import { BlikkClientError } from './blikkClient.types'

/**
 * Transport client for the Blikk e-commerce payments API, built on the client generated from
 * Blikk's OpenAPI document. The base URL, the `API-Key` header, timeouts, circuit breaking, metrics
 * and logging are configured in {@link BlikkClientModule} (via the enhanced fetch). It is
 * provider-specific but domain-agnostic: it returns raw Blikk responses and throws
 * {@link BlikkClientError} on any failure — mapping to domain error codes is the caller's job.
 */
@Injectable()
export class BlikkClientService {
  /**
   * `POST /ecom/v3/payments/direct-debtor` — create a direct-debtor payment attempt. The debtor's
   * national id (`debtorExternalId`) and bank account number (`debtorBban`) are supplied up front.
   */
  async createPayment(
    body: CreateDirectDebtorPaymentReqBody,
  ): Promise<CreateDirectDebtorPaymentBody> {
    const { data } = await this.send('/v3/payments/direct-debtor', () =>
      createDirectDebtorPayment({ body, throwOnError: true }),
    )
    return data
  }

  /** `GET /ecom/v3/payments/{id}` — fetch the authoritative payment state. */
  async getPayment(providerPaymentId: string): Promise<GetPaymentOutputBody> {
    const { data } = await this.send('/v3/payments/{id}', () =>
      getPayment({ path: { id: providerPaymentId }, throwOnError: true }),
    )
    return data
  }

  /**
   * `POST /ecom/v3/payments/cancel/{id}` — cancel a payment. Blikk only honours this while the
   * payment is in DRAFT; a past-DRAFT payment yields a non-2xx, surfaced as a {@link BlikkClientError}
   * (with the HTTP `status`) so the caller can decide whether the local state may be discarded.
   * The body is required by Blikk; `cancelMessage` is the reason shown on their side.
   */
  async cancelPayment(providerPaymentId: string): Promise<void> {
    await this.send('/v3/payments/cancel/{id}', () =>
      cancelPayment({
        path: { id: providerPaymentId },
        body: { cancelMessage: 'Cancelled by payer' },
        throwOnError: true,
      }),
    )
  }

  private async send<T>(path: string, request: () => Promise<T>): Promise<T> {
    try {
      return await request()
    } catch (e) {
      // The enhanced fetch has already logged the failure with the full error body; this only
      // converts to the client's error type. For a non-2xx, Blikk's reason (Problem Details
      // `detail`) is folded into the message so callers can log it with their own context.
      const fallbackMessage =
        (e as Error)?.message ?? `Blikk request failed for ${path}`

      if (!(e instanceof FetchError)) {
        throw new BlikkClientError(fallbackMessage)
      }

      const detail = blikkProblemDetail(e.problem ?? e.body)
      throw new BlikkClientError(
        detail
          ? `Blikk request failed (${e.status}): ${detail}`
          : fallbackMessage,
        e.status,
      )
    }
  }
}

/** Blikk's `detail` when the captured error body is RFC 9457 Problem Details. */
const blikkProblemDetail = (body: unknown): string | undefined => {
  const detail = (body as ErrorModel | null | undefined)?.detail
  return typeof detail === 'string' ? detail : undefined
}
