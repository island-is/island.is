import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  migrationDate: z.date(),
  workerProcessPageSize: z.number(),
  email: z.object({
    fromEmail: z.string(),
    fromName: z.string(),
    servicePortalBaseUrl: z.string(),
  }),
})

export const UserProfileConfig = defineConfig({
  name: 'UserProfileApi',
  schema,
  load(env) {
    return {
      migrationDate: new Date(
        env.optional('USER_PROFILE_MIGRATION_DATE') ?? '2024-04-10',
      ),
      workerProcessPageSize: env.optionalJSON<number>(
        'USER_PROFILE_WORKER_PAGE_SIZE',
        3000,
      ),
      email: {
        fromEmail: env.required('EMAIL_FROM', 'noreply@island.is'),
        fromName: env.required('EMAIL_FROM_NAME', 'island.is'),
        servicePortalBaseUrl: env.required(
          'SERVICE_PORTAL_BASE_URL',
          'http://localhost:4200',
        ),
      },
    }
  },
})
