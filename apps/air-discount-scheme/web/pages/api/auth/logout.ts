import { NextApiRequest, NextApiResponse } from 'next'
import environment from '@island.is/air-discount-scheme-web/environments/environment'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    //`https://${process.env.IDENTITY_SERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${process.env.IDENTITY_SERVER_LOGOUT_URL}`,
    `${environment.IDENTITY_SERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${environment.IDENTITY_SERVER_LOGOUT_URL}`,
  )
}
