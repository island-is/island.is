import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  email: z.object({
    fromEmail: z.string(),
    fromName: z.string(),
  }),
})

export const IdentityConfirmationApiConfig = defineConfig({
  name: 'IdentityConfirmationApi',
  schema,
  load(env) {
    return {
      email: {
        fromEmail: env.required('EMAIL_FROM', 'noreply@island.is'),
        fromName: env.required('EMAIL_FROM_NAME', 'island.is'),
      },
    }
  },
})
