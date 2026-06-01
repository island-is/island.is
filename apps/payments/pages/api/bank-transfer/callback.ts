import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import initApollo from '../../../graphql/client'
import {
  VerifyBankTransferMutation,
  VerifyBankTransferMutationVariables,
  VerifyBankTransferDocument,
} from '../../../graphql/mutations.graphql.generated'

/**
 * Provider (Blikk) webhook. Blikk POSTs status changes here; we proxy through the GraphQL gateway
 * (`paymentsVerifyBankTransfer`) to the payments-service's `verify` endpoint, which is idempotent.
 *
 * Always returns 200 — the provider retries on non-2xx and we don't want them to. Settlement is
 * idempotent and a missed callback is recovered by the frontend's polling loop on the flow page.
 *
 * TODO: verify the inbound POST is actually from Blikk (HMAC/signature header) once we know Blikk's
 * signing scheme. Until then the route is bounded only by `verify` being idempotent and only acting
 * on existing rows.
 */
const BlikkCallbackSchema = z.object({
  id: z.string().min(1),
  // Accepted-and-logged but ignored — the authoritative state is fetched inside `verify`.
  status: z.string().optional(),
  sourceReferenceId: z.string().optional(),
})

export default async function bankTransferCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('BANK TRANSFER CALLBACK RECEIVED', req.body)
  if (req.method !== 'POST') {
    // Even for the "wrong method" case we return 200 to keep Blikk's webhook off the retry path.
    return res
      .status(200)
      .json({ received: false, reason: 'method-not-allowed' })
  }

  let id: string
  let status: string | undefined
  let sourceReferenceId: string | undefined
  try {
    ;({ id, status, sourceReferenceId } = BlikkCallbackSchema.parse(req.body))
  } catch (e) {
    console.error('Bank transfer callback: invalid body', e)
    return res.status(200).json({ received: false, reason: 'invalid-body' })
  }

  console.info('Bank transfer callback received', {
    providerPaymentId: id,
    status,
    sourceReferenceId,
  })

  try {
    const client = initApollo()
    await client.mutate<
      VerifyBankTransferMutation,
      VerifyBankTransferMutationVariables
    >({
      mutation: VerifyBankTransferDocument,
      variables: { input: { providerPaymentId: id } },
    })
  } catch (e) {
    // Swallow — Blikk must not retry. Frontend polling is the backstop.
    console.error(
      `Bank transfer callback: verify mutation failed for providerPaymentId ${id}`,
      e,
    )
  }

  return res.status(200).json({ received: true })
}
