const devConfig = {
  production: false,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:4200',
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

const prodConfig = {
  production: true,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
