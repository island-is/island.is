export default {
  production: true,
  airlineApiKeys: {
    airIcelandConnect: process.env.AIR_ICELAND_CONNECT_API_KEY,
    ernir: process.env.ERNIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
