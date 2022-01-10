import { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@island.is/air-discount-scheme-web/lib/environments'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    //`https://${process.env.IDENTITY_SERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${process.env.IDENTITY_SERVER_LOGOUT_URL}`,
    `${env.IDENTITY_SERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${env.IDENTITY_SERVER_LOGOUT_URL}`,
  )
}
