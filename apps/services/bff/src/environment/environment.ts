import { BffEnvironment, environmentSchema } from './environment.schema'

const isProduction = process.env.NODE_ENV === 'production'

const parsedEnvironment = environmentSchema.parse({
  production: isProduction,
  port: process.env.PORT,
  keyPath: process.env.BFF_CLIENT_KEY_PATH,
  ...(!isProduction && {
    enableCors: {
      // Allowed origin(s)
      origin: ['http://localhost:4200'],
      methods: ['GET', 'POST'],
      // Allow cookies and credentials to be sent
      credentials: true,
    },
  }),
})

export const environment: BffEnvironment = parsedEnvironment
