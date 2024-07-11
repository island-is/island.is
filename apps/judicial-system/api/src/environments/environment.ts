const devConfig = {
  production: false,
  backend: {
    url: 'http://localhost:3344',
    secretToken: 'secret-backend-api-token',
  },
}
if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
}

const prodConfig = {
  production: true,
  backend: {
    url: process.env.BACKEND_URL,
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
