import { NextApiRequest, NextApiResponse } from 'next'
import { session } from 'next-auth/client'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return session
}
