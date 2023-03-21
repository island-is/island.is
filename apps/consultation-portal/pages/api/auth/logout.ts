import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', ['token=; expires=0; path=/'])
  return res.status(200).json({
    success: 'success',
  })
}
