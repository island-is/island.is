import type { ApolloError } from '@apollo/client'
import { sign } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { findProblemInApolloError } from '@island.is/shared/problem'

import { getServerRuntimeEnv } from '../../../environments/runtimeEnvironment'
import initApollo from '../../../graphql/client'
import {
  VerificationCallbackMutation,
  VerificationCallbackMutationVariables,
  VerificationCallbackDocument,
  VerificationCallbackFailedMutation,
  VerificationCallbackFailedMutationVariables,
  VerificationCallbackFailedDocument,
} from '../../../graphql/mutations.graphql.generated'

// The 3-D Secure ACS posts the verification result here as
// application/x-www-form-urlencoded. `cavv` and `TDS2.dsTransID` are only present on a
// completed authentication (mdStatus success). A schema miss therefore signals an
// incomplete or invalid callback — a declined/attempted/abandoned authentication, but
// possibly also a malformed request or a changed provider contract. In every case it is
// a return-flow outcome, not a server crash: throwing renders a broken 500 page inside
// the ACS iframe and blocks the payer, so we redirect to the failure screen instead.
const VerificationCallbackSchema = z.object({
  // Not used for the charge (the gateway removed it from CardVerificationData)
  // and not sent by every EMV 3DS flow, so it must not decide the outcome
  xid: z.string().optional(),
  mdStatus: z.string().min(1, 'mdStatus status is required'),
  MD: z.string().min(1, 'MD is required'),
  cavv: z.string().min(1, 'cavv is required'),
  ['TDS2.dsTransID']: z.string().min(1, 'TDS2.dsTransID is required'),
})

// Non-sensitive 3DS outcome fields from the gateway callback, logged to triage
// failures. `callbackSource` tells whether the result came from the cardholder's
// browser, the gateway server, or a server "Fallback" after the ACS did not respond.
// Never log cavv, xid, MD, dsTransId or cardholderInfo. Values come from an
// external POST, so they are capped in length.
const MAX_DIAGNOSTIC_LENGTH = 64
const MAX_MD_LENGTH = 1024

// mdStatus values the payments service charges with (see toGatewayMdStatus in
// the payments service). Any other mdStatus means the 3DS attempt failed.
const CHARGEABLE_MD_STATUSES = ['1', '2', '4', '5']

// Only an mdStatus that cannot be charged reports the attempt as failed. A
// callback that is merely missing fields could be a partial or malformed
// request, and marking the attempt failed on it would stop a valid result for
// the same attempt (e.g. from the gateway server) from completing the payment.
const isFailedAuthentication = (mdStatus: string | null) =>
  !!mdStatus && !CHARGEABLE_MD_STATUSES.includes(mdStatus)

const getCallbackDiagnostics = (body: Record<string, unknown>) => {
  const read = (key: string) =>
    typeof body[key] === 'string' && body[key]
      ? (body[key] as string).slice(0, MAX_DIAGNOSTIC_LENGTH)
      : null

  return {
    mdStatus: read('mdStatus'),
    callbackSource: read('callbackSource'),
    transStatus: read('TDS2.transStatus'),
    transStatusReason: read('TDS2.transStatusReason'),
    authType: read('authType'),
    threeDSMessageVersion: read('threeDSMessageVersion'),
  }
}

// findProblemInApolloError expects an ApolloError and throws on anything else
// (e.g. a network error), which would turn a handled failure into a 500.
const getErrorDetail = (e: unknown) => {
  const problem =
    e && typeof e === 'object' && 'graphQLErrors' in e
      ? findProblemInApolloError(e as ApolloError)
      : undefined
  return problem?.detail ?? (e instanceof Error ? e.message : 'unknown error')
}

// Tells the payments service that the current 3DS attempt failed, so the payment
// page stops waiting. The result may come from the gateway server rather than the
// payer's browser, in which case the 3DS iframe never shows our failure page and
// this is the only way the payment page finds out. Best effort: the payer is sent
// to the failure page either way.
const reportFailedVerification = async (body: Record<string, unknown>) => {
  const md = typeof body.MD === 'string' ? body.MD : ''

  // The MD is our own signed token of a few hundred characters. Anything else
  // is not worth a round trip to the payments service.
  if (!md || md.length > MAX_MD_LENGTH) {
    return
  }

  const { mdStatus, callbackSource, transStatus, transStatusReason } =
    getCallbackDiagnostics(body)

  const { verificationCallbackSigningSecret } = getServerRuntimeEnv()

  const verificationToken = sign(
    {
      md,
      mdStatus: mdStatus ?? undefined,
      callbackSource: callbackSource ?? undefined,
      transStatus: transStatus ?? undefined,
      transStatusReason: transStatusReason ?? undefined,
    },
    verificationCallbackSigningSecret,
  )

  try {
    const { errors } = await initApollo().mutate<
      VerificationCallbackFailedMutation,
      VerificationCallbackFailedMutationVariables
    >({
      mutation: VerificationCallbackFailedDocument,
      variables: { input: { verificationToken } },
    })

    if (errors) {
      console.error(
        'Card verification callback: failed-verification mutation returned errors',
      )
    }
  } catch (e) {
    console.error(
      'Card verification callback: failed-verification mutation failed',
      { detail: getErrorDetail(e) },
    )
  }
}

// POST/Redirect/GET back to the (GET) result page. 303 (not 307) so the browser issues a
// GET and the sensitive 3DS callback fields are not re-posted to the page route.
const SUCCESS_REDIRECT = '/greida/3ds'
const FAILURE_REDIRECT = '/greida/3ds?status=failed'

export default async function cardVerificationCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' })
  }

  // The ACS may append parameters, e.g. `application/x-www-form-urlencoded; charset=UTF-8`,
  // so match on the media type rather than requiring exact equality.
  const contentType = req.headers['content-type'] ?? ''

  if (!contentType.startsWith('application/x-www-form-urlencoded')) {
    console.error('Card verification callback: unexpected content-type', {
      contentType: contentType.split(';')[0] || null,
    })
    return res.redirect(303, FAILURE_REDIRECT)
  }

  const parsed = VerificationCallbackSchema.safeParse(req.body)

  if (!parsed.success) {
    // The callback was incomplete or invalid (declined/attempted/abandoned auth, a
    // malformed request, or a changed provider contract). Log booleans + mdStatus only
    // (never the raw 3DS payload or cardholder data) so the outcome can be triaged, then
    // send the payer to the failure screen instead of crashing.
    const body = (req.body ?? {}) as Record<string, unknown>
    const isPresent = (key: string) => {
      const value = body[key]
      return typeof value === 'string' && value.length > 0
    }
    const requiredFields = ['mdStatus', 'MD', 'cavv', 'TDS2.dsTransID']
    const diagnostics = getCallbackDiagnostics(body)
    const isFailed = isFailedAuthentication(diagnostics.mdStatus)

    console.error(
      'Card verification callback: incomplete or invalid callback',
      {
        ...diagnostics,
        hasXid: isPresent('xid'),
        hasMd: isPresent('MD'),
        hasCavv: isPresent('cavv'),
        hasDsTransId: isPresent('TDS2.dsTransID'),
        missingFields: requiredFields.filter((key) => !isPresent(key)),
        reportedAsFailed: isFailed,
      },
    )

    if (isFailed) {
      await reportFailedVerification(body)
    }

    return res.redirect(303, FAILURE_REDIRECT)
  }

  const { xid, mdStatus, MD, cavv } = parsed.data
  const dsTransId = parsed.data['TDS2.dsTransID']

  const diagnostics = getCallbackDiagnostics(
    (req.body ?? {}) as Record<string, unknown>,
  )

  console.info('Card verification callback: received', diagnostics)

  const client = initApollo()

  const { verificationCallbackSigningSecret } = getServerRuntimeEnv()

  // The verification callback will only accept signed tokens
  const verificationToken = sign(
    {
      xid,
      mdStatus,
      md: MD,
      cavv,
      dsTransId,
      // Required by the gateway in the charge
      threeDSMessageVersion: diagnostics.threeDSMessageVersion ?? undefined,
    },
    verificationCallbackSigningSecret,
  )

  try {
    const { errors } = await client.mutate<
      VerificationCallbackMutation,
      VerificationCallbackMutationVariables
    >({
      mutation: VerificationCallbackDocument,
      variables: {
        input: {
          verificationToken,
        },
      },
    })

    if (errors) {
      console.error(
        'Card verification callback: verify mutation returned errors',
      )
      return res.redirect(303, FAILURE_REDIRECT)
    }

    return res.redirect(303, SUCCESS_REDIRECT)
  } catch (e) {
    console.error('Card verification callback: verify mutation failed', {
      detail: getErrorDetail(e),
    })
    return res.redirect(303, FAILURE_REDIRECT)
  }
}
