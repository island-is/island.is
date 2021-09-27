/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function handler(req, res) {
  res.redirect(
    `https://${process.env.IDENTITYSERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=/`,
  )
}
