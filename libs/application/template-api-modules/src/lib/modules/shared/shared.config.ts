import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const SharedModuleConfig = z.object({
  jwtSecret: z.string(),
  clientLocationOrigin: z.string(),
  email: z.object({
    sender: z.string(),
    address: z.string(),
  }),
  baseApiUrl: z.string(),
  attachmentBucket: z.string(),
})

export const sharedModuleConfig = defineConfig({
  name: 'SharedModuleConfig',
  schema: SharedModuleConfig,
  load: (env) => ({
    jwtSecret: env.required('AUTH_JWT_SECRET', 'supersecret'),
    clientLocationOrigin: env.required(
      'CLIENT_LOCATION_ORIGIN',
      `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`,
    ),
    email: {
      sender: env.required('EMAIL_FROM_NAME', 'Devland.is'),
      address: env.required('EMAIL_FROM', 'development@island.is'),
    },
    baseApiUrl: env.required('GRAPHQL_API_URL', 'http://localhost:4444'),
    attachmentBucket: env.required('APPLICATION_ATTACHMENT_BUCKET'),
  }),
})
