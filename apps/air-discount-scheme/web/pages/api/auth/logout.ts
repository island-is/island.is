import { NextApiRequest, NextApiResponse } from 'next'
import env from '@island.is/air-discount-scheme-web/lib/environment'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    `https://${env.identityServerDomain}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${env.identityServerLogoutURL}`,
  )
}
