export default {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
}
