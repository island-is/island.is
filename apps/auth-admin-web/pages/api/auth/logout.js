export default function handler(req, res) {
  res.redirect(
    `https://${process.env.IDENTITYSERVER_DOMAIN}/connect/endsession`
  );
}
// TODO: Ideally we would send post_logout_redirect_uri which requires id_token_hint also. But currently the
// id token is not available when using next-auth. See https://github.com/nextauthjs/next-auth/pull/837
