import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

export type SharedModuleConfigType = z.infer<typeof SharedModuleConfig>

const SharedModuleConfig = z.object({
  baseApiUrl: z.string(),
  clientLocationOrigin: z.string(),
  audit: z.object({
    defaultNamespace: z.string(),
    groupName: z.string(),
    serviceName: z.string(),
  }),
  auth: z.object({
    issuer: z.string(),
    audience: z.array(z.string()),
    allowClientNationalId: z.boolean(),
  }),
  templateApi: z.object({
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
      endorsementApiBasePath: z.string(),
    }),
    userProfile: z.object({
      serviceBasePath: z.string(),
    }),
  }),
  contentful: z.object({
    accessToken: z.string(),
  }),
})

export const sharedModuleConfig = defineConfig({
  name: 'SharedModuleConfig',
  schema: SharedModuleConfig,
  load: (env) => ({
    baseApiUrl: env.required('GRAPHQL_API_URL', 'http://localhost:4444'),
    clientLocationOrigin: env.required(
      'CLIENT_LOCATION_ORIGIN',
      `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`,
    ),
    audit: {
      defaultNamespace: '@island.is/applications',
      groupName: env.required('AUDIT_GROUP_NAME', ''),
      serviceName: 'application-system-api',
    },
    auth: {
      issuer: env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ),
      audience: ['@island.is', '@admin.island.is'],
      allowClientNationalId: true,
    },
    templateApi: {
      clientLocationOrigin: env.required(
        'CLIENT_LOCATION_ORIGIN',
        `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`,
      ),
      email: {
        sender: env.required('EMAIL_FROM_NAME', 'Devland.is'),
        address: env.required('EMAIL_FROM', 'development@island.is'),
      },
      jwtSecret: env.required('AUTH_JWT_SECRET', 'supersecret'),
      xRoadBasePathWithEnv: env.required('XROAD_BASE_PATH_WITH_ENV', ''),
      baseApiUrl: env.required('GRAPHQL_API_URL', 'http://localhost:4444'),
      presignBucket: env.required('FILE_SERVICE_PRESIGN_BUCKET', ''),
      attachmentBucket: env.required(
        'APPLICATION_ATTACHMENT_BUCKET',
        'island-is-dev-storage-application-system',
      ),
      generalPetition: {
        endorsementApiBasePath: env.required(
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
    },
    contentful: {
      accessToken: env.required('CONTENTFUL_ACCESS_TOKEN'),
    },
  }),
})
