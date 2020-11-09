export default {
  production: true,
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
