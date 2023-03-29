import { parseCookie } from '../../../utils/helpers'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = parseCookie(req.headers.cookie)
  if (cookie) {
    if ('token' in cookie) {
      const token = cookie['token']
      return res.status(200).json({
        token: token,
      })
    }
  }
  return res.status(200).json({
    token: '',
  })
}
