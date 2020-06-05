export default {
  production: false,
  applicationUrl: 'http://localhost:4242',
  ferdalag: {
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
  },
  yay: {
    url: 'https://dev-serviceapi.yay.is',
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
}
