export default {
  production: true,
  airlineApiKeys: {
    icelandair: process.env.ICELANDAIR_API_KEY,
    ernir: process.env.ERNIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
