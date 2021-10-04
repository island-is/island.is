import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    `https://${process.env.IDENTITYSERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=/`,
  )
}
