const devConfig = {
  production: false,
  auth: {
    secretToken: 'secret-token',
  },
  backend: {
    url: 'http://localhost:3344',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
  }
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    secretToken: process.env.SECRET_TOKEN,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
