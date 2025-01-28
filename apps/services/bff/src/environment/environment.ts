import { BffEnvironment, environmentSchema } from './environment.schema'

export const isProduction = process.env.NODE_ENV === 'production'

const parsedEnvironment = environmentSchema.parse({
  production: isProduction,
  port: process.env.PORT,
  globalPrefix: process.env.BFF_GLOBAL_PREFIX,
  name: process.env.BFF_NAME,
})

export const environment: BffEnvironment = parsedEnvironment
