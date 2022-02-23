import { NextApiRequest, NextApiResponse } from 'next'

import { environment } from '../../../environments'

const { identityProvider } = environment

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    `https://${identityProvider.domain}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${identityProvider.logoutRedirectUrl}`,
  )
}
