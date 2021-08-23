if (process.env.NODE_ENV === 'production') {
  if (!process.env.ALLOW_FAKE_USERS) {
    throw new Error('Missing ALLOW_FAKE_USERS environment.')
  }
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
  }
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
  // TODO Add validation when the values are in the parametter store

  // if (!process.env.SAML_ENTRY_POINT_OSK) {
  //   throw new Error('Missing SAML_ENTRY_POINT_OSK environment.')
  // }
  // if (!process.env.SAML_ENTRY_POINT_VEITA) {
  //   throw new Error('Missing SAML_ENTRY_POINT_VEITA environment.')
  // }
  // if (!process.env.SAML_ENTRY_POINT_VEITA) {
  //   throw new Error('Missing SAML_ENTRY_POINT_VEITA environment.')
  // }
  // if (!process.env.AUTH_AUDIENCE_OSK) {
  //   throw new Error('Missing AUTH_AUDIENCE_OSK environment.')
  // }
  // if (!process.env.audienceVeita) {
  //   throw new Error('Missing audienceVeita environment.')
  // }
}

// TODO Remove default values when the values are in the parametter store.
const prodConfig = {
  production: true,
  auth: {
    samlEntryPointOsk:
      process.env.SAML_ENTRY_POINT_OSK ??
      'https://innskraning.island.is/?id=financial-aid-osk.development',
    samlEntryPointVeita:
      process.env.SAML_ENTRY_POINT_VEITA ??
      'https://innskraning.island.is/?id=financial-aid-veita.development',
    audienceOsk:
      process.env.AUTH_AUDIENCE_OSK ?? 'fjarhagsadstod.dev.sveitarfelog.net',
    audienceVeita:
      process.env.AUTH_AUDIENCE_VEITA ??
      'veita-fjarhagsadstod.dev.sveitarfelog.net',
    allowFakeUsers: process.env.ALLOW_FAKE_USERS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET!,
    secretToken: process.env.SECRET_TOKEN!,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}

const devConfig = {
  production: false,
  auth: {
    samlEntryPointOsk:
      'https://innskraning.island.is/?id=financial-aid-osk.local',
    samlEntryPointVeita:
      'https://innskraning.island.is/?id=financial-aid-veita.local',
    audienceOsk: 'localhost:4200',
    audienceVeita: 'localhost:4200',
    allowAuthBypass: true,
    allowFakeUsers: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  backend: {
    url: 'http://localhost:3344',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
