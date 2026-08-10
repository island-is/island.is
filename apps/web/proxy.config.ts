const proxyConfig = {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:4444',
    secure: false,
  },
}

export default proxyConfig
