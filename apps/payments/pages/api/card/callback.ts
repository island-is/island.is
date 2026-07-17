import { sign } from 'jsonwebtoken'
import getConfig from 'next/config'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { findProblemInApolloError } from '@island.is/shared/problem'

import initApollo from '../../../graphql/client'
import {
  VerificationCallbackMutation,
  VerificationCallbackMutationVariables,
  VerificationCallbackDocument,
} from '../../../graphql/mutations.graphql.generated'

// The 3-D Secure ACS posts the verification result here as
// application/x-www-form-urlencoded. `cavv` and `TDS2.dsTransID` are only present on a
// completed authentication (mdStatus success). A schema miss therefore signals an
// incomplete or invalid callback — a declined/attempted/abandoned authentication, but
// possibly also a malformed request or a changed provider contract. In every case it is
// a return-flow outcome, not a server crash: throwing renders a broken 500 page inside
// the ACS iframe and blocks the payer, so we redirect to the failure screen instead.
const VerificationCallbackSchema = z.object({
  xid: z.string().min(1, 'xid is required'),
  mdStatus: z.string().min(1, 'mdStatus status is required'),
  MD: z.string().min(1, 'MD is required'),
  cavv: z.string().min(1, 'cavv is required'),
  ['TDS2.dsTransID']: z.string().min(1, 'TDS2.dsTransID is required'),
})

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
    const requiredFields = ['xid', 'mdStatus', 'MD', 'cavv', 'TDS2.dsTransID']

    console.error(
      'Card verification callback: incomplete or invalid callback',
      {
        mdStatus: typeof body.mdStatus === 'string' ? body.mdStatus : null,
        hasXid: isPresent('xid'),
        hasMd: isPresent('MD'),
        hasCavv: isPresent('cavv'),
        hasDsTransId: isPresent('TDS2.dsTransID'),
        missingFields: requiredFields.filter((key) => !isPresent(key)),
      },
    )

    return res.redirect(303, FAILURE_REDIRECT)
  }

  const { xid, mdStatus, MD, cavv } = parsed.data
  const dsTransId = parsed.data['TDS2.dsTransID']

  const client = initApollo()

  const {
    serverRuntimeConfig: { verificationCallbackSigningSecret },
  } = getConfig()

  // The verification callback will only accept signed tokens
  const verificationToken = sign(
    {
      xid,
      mdStatus,
      md: MD,
      cavv,
      dsTransId,
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
    const problem = findProblemInApolloError(e)
    console.error('Card verification callback: verify mutation failed', {
      detail:
        problem?.detail ?? (e instanceof Error ? e.message : 'unknown error'),
    })
    return res.redirect(303, FAILURE_REDIRECT)
  }
}
