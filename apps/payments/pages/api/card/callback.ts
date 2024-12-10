import { getTempRedisStorage } from 'apps/payments/services/payment'
import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import getConfig from 'next/config'

export default async function cardVerificationCompleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { MD } = req.body

  if (!MD) {
    return res.status(400).json({ error: 'MD is required' })
  }

  const {
    serverRuntimeConfig: {
      paymentsTokenSigningSecret,
      paymentsTokenSignaturePrefix,
    },
  } = getConfig()

  try {
    const jwtMd = `${paymentsTokenSignaturePrefix}.${Buffer.from(
      MD,
      'base64',
    ).toString('utf-8')}`

    const payload = verify(jwtMd, paymentsTokenSigningSecret) as any

    const { c, a, iat } = payload

    if (Date.now() - iat * 1000 > 60 * 1000) {
      return res.status(400).json({ error: 'Invalid verification' })
    }

    const storedValue = getTempRedisStorage().getAndForget(c)

    if (!storedValue) {
      return res.status(400).json({ error: 'Invalid verification' })
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
