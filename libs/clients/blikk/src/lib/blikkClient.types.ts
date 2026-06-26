import { z } from 'zod'

/** Blikk line item shape (wire contract). */
export interface BlikkItem {
  name: string
  quantity: number
  unitPrice: string
  description?: string
  sku?: string
}

/** Request body for `POST /ecom/v3/payments`. */
export interface CreateBlikkPaymentRequest {
  amount: number
  currency: string
  sourceReferenceId: string
  callbackUrl?: string
  partnerRedirectUrl?: string
  source?: string
  // Unix seconds.
  expiresAt?: number
  items?: BlikkItem[]
  // Deptor -> payer
  debtorExternalId?: string
  debtorName?: string
  debtorBban?: string
}

export const blikkCreatePaymentResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  scaRedirectUrl: z.string().optional(),
  message: z.string().optional(),
  partnerRedirectUrl: z.string().optional(),
})

export const blikkGetPaymentResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  scaRedirectUrl: z.string().optional(),
  message: z.string().optional(),
})

export type BlikkCreatePaymentResponse = z.infer<
  typeof blikkCreatePaymentResponseSchema
>
export type BlikkGetPaymentResponse = z.infer<
  typeof blikkGetPaymentResponseSchema
>

/**
 * Transport-level error thrown by the Blikk client for any non-2xx response, network/timeout
 * failure, or unparseable response body. `status` carries the HTTP status when one was received
 * (callers use it to distinguish e.g. a 404 from a live-payment conflict).
 */
export class BlikkClientError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'BlikkClientError'
    this.status = status
  }
}
