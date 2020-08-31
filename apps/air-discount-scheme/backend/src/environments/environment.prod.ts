export default {
  production: true,
  thjodskra: {
    url: process.env.THJODSKRA_URL,
    username: 'si_flugfargjold',
    password: process.env.THJODSKRA_PASSWORD,
  },
  airlineApiKeys: {
    icelandair: process.env.ICELANDAIR_API_KEY,
    ernir: process.env.ERNIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
