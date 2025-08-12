import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('req', req)
  res.status(200).json({ message: 'Hello, world!' })
}
