const devConfig = {
  production: false,
}

const prodConfig = {
  production: true,
}

export const environment = {
  idsCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
