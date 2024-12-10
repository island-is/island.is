import { getTempRedisStorage } from 'apps/payments/services/payment'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function chargeCardHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const tempStorage = getTempRedisStorage()

  const counter = (tempStorage.get('counter') || 0) + 1
  tempStorage.set('counter', counter)

  return res.status(200).json({ success: true, counter })
}
