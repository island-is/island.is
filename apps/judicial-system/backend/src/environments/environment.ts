const devConfig = {
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD ?? '',
    acceptUnauthorized: true,
  },
  emailOptions: {
    useTestAccount: (process.env.EMAIL_USE_TEST_ACCOUNT ?? 'true') === 'true',
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.NOVA_URL) {
    throw new Error('Missing NOVA_URL environment.')
  }
  if (!process.env.NOVA_USERNAME) {
    throw new Error('Missing NOVA_USERNAME environment.')
  }
  if (!process.env.NOVA_PASSWORD) {
    throw new Error('Missing NOVA_PASSWORD environment.')
  }
  if (!process.env.EMAIL_REGION) {
    throw new Error('Missing EMAIL_REGION environment.')
  }
}

const prodConfig = {
  smsOptions: {
    url: process.env.NOVA_URL ?? '',
    username: process.env.NOVA_USERNAME ?? '',
    password: process.env.NOVA_PASSWORD ?? '',
    acceptUnauthorized: process.env.NOVA_ACCEPT_UNAUTHORIZED === 'true',
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
