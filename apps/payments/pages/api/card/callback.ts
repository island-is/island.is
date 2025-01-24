import { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'

import initApollo from '../../../graphql/client'

import {
  VerificationCallbackMutation,
  VerificationCallbackMutationVariables,
  VerificationCallbackDocument,
} from '../../../graphql/mutations.graphql.generated'
import getConfig from 'next/config'
import { findProblemInApolloError } from '@island.is/shared/problem'

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

  const { xid, mdStatus, MD, cavv, dsTransId } = req.body

  if (!MD) {
    return res.status(400).json({ error: 'MD is required' })
  }

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
    await client.mutate<
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

    return res.status(200).json({})
  } catch (e) {
    const problem = findProblemInApolloError(e)

    if (problem?.detail) {
      return res.status(400).json({ error: problem.detail })
    }

    console.error(e)
    return res.status(503).json({ error: 'Unknown error occured' })
  }
}
