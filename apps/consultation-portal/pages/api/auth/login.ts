import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token, expiry } = JSON.parse(req.body)
    const exp = new Date(expiry * 1000)

    res.setHeader('Set-Cookie', [
      `token=${token}; httpOnly; expires=${exp}; SameSite=Strict; path=/`,
    ])
    return res.status(200).json({
      success: 'success',
    })
  } catch (e) {
    console.error(e)
  }
  return res.status(500).json({
    error: 'error',
  })
}
