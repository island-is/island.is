export default async function handler(req, res) {
  res.redirect(
    `https://${process.env.IDENTITYSERVER_DOMAIN}/connect/endsession?id_token_hint=${req.query.id_token}&post_logout_redirect_uri=${process.env.NEXTAUTH_URL}`
  );
}
