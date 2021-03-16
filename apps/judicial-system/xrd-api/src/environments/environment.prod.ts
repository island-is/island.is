export const environment = {
  production: true,
  auth: {
    secretToken: process.env.SECRET_TOKEN,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}
