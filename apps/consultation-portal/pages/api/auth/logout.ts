import { NextApiRequest, NextApiResponse } from 'next'
import env from '../../../lib/environment'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const idToken =
    req.cookies['samradsgatt-id-token'] || (req.query.id_token as string)

  // Clear the id-token cookie
  res.setHeader(
    'Set-Cookie',
    'samradsgatt-id-token=; Path=/samradsgatt; HttpOnly; SameSite=Lax; Max-Age=0',
  )

  res.redirect(
    `https://${env.identityServerDomain}/connect/endsession?id_token_hint=${idToken}&post_logout_redirect_uri=${env.identityServerLogoutURL}`,
  )
}
