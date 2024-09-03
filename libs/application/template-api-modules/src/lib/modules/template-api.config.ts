import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const TemplateApiConfig = z.object({
  clientLocationOrigin: z.string(),
  email: z.object({
    sender: z.string(),
    address: z.string(),
  }),
  jwtSecret: z.string(),
  xRoadBasePathWithEnv: z.string(),
  baseApiUrl: z.string(),
  presignBucket: z.string(),
  attachmentBucket: z.string(),
  generalPetition: z.object({
    endorsementsApiBasePath: z.string(),
  }),
  userProfile: z.object({
    serviceBasePath: z.string(),
  }),
})

export const templateAPIConfig = defineConfig({
  name: 'TemplateAPIConfig',
  schema: TemplateApiConfig,
  load: (env) => ({
    clientLocationOrigin: env.required(
      'CLIENT_LOCATION_ORIGIN',
      `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`,
    ),
    email: {
      sender: env.required('EMAIL_FROM_NAME', 'Devland.is'),
      address: env.required('EMAIL_FROM', 'development@island.is'),
    },
    jwtSecret: env.required('AUTH_JWT_SECRET', 'supersecret'),
    xRoadBasePathWithEnv: env.required('XROAD_BASE_PATH_WITH_ENV'),
    baseApiUrl: env.required('GRAPHQL_API_URL', 'http://localhost:4444'),
    presignBucket: env.required('FILE_SERVICE_PRESIGN_BUCKET'),
    attachmentBucket: env.required('APPLICATION_ATTACHMENT_BUCKET'),
    generalPetition: {
      endorsementsApiBasePath: env.required(
        'ENDORSEMENTS_API_BASE_PATH',
        'http://localhost:4246',
      ),
    },
    userProfile: {
      serviceBasePath: env.required(
        'SERVICE_USER_PROFILE_URL',
        'http://localhost:3366',
      ),
    },
  }),
})
