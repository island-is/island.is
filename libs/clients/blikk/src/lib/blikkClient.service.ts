import { Inject, Injectable } from '@nestjs/common'
import type { ZodType } from 'zod'

import {
  EnhancedFetchAPI,
  FetchError,
} from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { BlikkClientConfig } from './blikkClient.config'
import { BlikkFetch } from './fetchConfig'
import {
  BlikkClientError,
  BlikkCreatePaymentResponse,
  BlikkGetPaymentResponse,
  CreateBlikkPaymentRequest,
  blikkCreatePaymentResponseSchema,
  blikkGetPaymentResponseSchema,
} from './blikkClient.types'

/**
 * Transport client for the Blikk e-commerce payments API. Owns the base URL, the `API-Key` header,
 * timeouts, circuit breaking, metrics and logging (via the enhanced fetch). It is provider-specific
 * but domain-agnostic: it returns raw, zod-validated Blikk responses and throws {@link BlikkClientError}
 * on any failure — mapping to domain error codes is the caller's job.
 */
@Injectable()
export class BlikkClientService {
  constructor(
    @Inject(BlikkClientConfig.KEY)
    private readonly config: ConfigType<typeof BlikkClientConfig>,
    @Inject(BlikkFetch)
    private readonly fetch: EnhancedFetchAPI,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /** `POST /ecom/v3/payments` — create a new payment attempt. */
  createPayment(
    body: CreateBlikkPaymentRequest,
  ): Promise<BlikkCreatePaymentResponse> {
    return this.send(
      'POST',
      '/ecom/v3/payments',
      blikkCreatePaymentResponseSchema,
      body,
    )
  }

  /** `GET /ecom/v3/payments/{id}` — fetch the authoritative payment state. */
  getPayment(providerPaymentId: string): Promise<BlikkGetPaymentResponse> {
    return this.send(
      'GET',
      `/ecom/v3/payments/${encodeURIComponent(providerPaymentId)}`,
      blikkGetPaymentResponseSchema,
    )
  }

  /**
   * `DELETE /ecom/v3/payments/{id}` — cancel a payment. Blikk only honours this while the payment is
   * in DRAFT; a past-DRAFT payment yields a non-2xx, surfaced as a {@link BlikkClientError} (with the
   * HTTP `status`) so the caller can decide whether the local state may be discarded.
   */
  async cancelPayment(providerPaymentId: string): Promise<void> {
    await this.request(
      'DELETE',
      `/ecom/v3/payments/${encodeURIComponent(providerPaymentId)}`,
    )
  }

  private async send<T>(
    method: 'GET' | 'POST',
    path: string,
    schema: ZodType<T>,
    body?: unknown,
  ): Promise<T> {
    const response = await this.request(method, path, body)

    let responseBody: unknown
    try {
      responseBody = await response.json()
    } catch {
      responseBody = undefined
    }

    const parsed = schema.safeParse(responseBody)
    if (!parsed.success) {
      this.logger.error('Failed to parse Blikk response', {
        method,
        path,
        parseError: parsed.error,
      })
      throw new BlikkClientError(`Failed to parse Blikk response for ${path}`)
    }

    return parsed.data
  }

  private async request(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    body?: unknown,
  ) {
    const url = `${this.config.basePath}${path}`

    try {
      return await this.fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch (e) {
      const status = e instanceof FetchError ? e.status : undefined
      this.logger.error('Blikk request failed', {
        method,
        path,
        status,
        error: (e as Error)?.message,
      })
      throw new BlikkClientError(
        (e as Error)?.message ?? `Blikk request failed for ${path}`,
        status,
      )
    }
  }
}
