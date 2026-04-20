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

const VerificationCallbackSchema = z.object({
  xid: z.string().min(1, 'xid is required'),
  mdStatus: z.string().min(1, 'mdStatus status is required'),
  MD: z.string().min(1, 'MD is required'),
  cavv: z.string().min(1, 'cavv is required'),
  ['TDS2.dsTransID']: z.string().min(1, 'TDS2.dsTransID is required'),
})

export default async function cardVerificationCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' })
  }

  const contentType = req.headers['content-type']

  if (contentType !== 'application/x-www-form-urlencoded') {
    return res.status(400).json({ error: 'Invalid content-type' })
  }

  const parsed = VerificationCallbackSchema.parse(req.body)

  const { xid, mdStatus, MD, cavv } = parsed
  const dsTransId = parsed['TDS2.dsTransID']

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
      return res.status(503).json({ error: 'Unknown error occured' })
    }

    return res.redirect(307, `/greida/3ds`)
  } catch (e) {
    const problem = findProblemInApolloError(e)

    if (problem?.detail) {
      return res.status(400).json({ error: problem.detail })
    }

    console.error(e)
    return res.status(503).json({ error: 'Unknown error occured' })
  }
}
