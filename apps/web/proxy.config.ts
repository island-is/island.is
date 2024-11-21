const proxyConfig = {
  '/api': {
    target: process.env.GRAPHQL_API_URL ?? 'http://localhost:4444',
    secure: false,
  },
}

export default proxyConfig
