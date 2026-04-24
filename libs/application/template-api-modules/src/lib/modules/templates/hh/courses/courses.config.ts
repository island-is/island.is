import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  applicationSenderName: z.string(),
  applicationSenderEmail: z.string(),
  applicationEmailSubject: z.string(),
  zendeskEnvTag: z.string(),
})

export const HHCoursesConfig = defineConfig({
  name: 'HHCoursesConfig',
  schema,
  load: (env) => ({
    applicationSenderName: env.required('EMAIL_FROM_NAME'),
    applicationSenderEmail: env.required('EMAIL_FROM'),
    applicationEmailSubject: env.required('HH_COURSES_ZENDESK_SUBJECT'),
    zendeskEnvTag: env.required('HH_COURSES_ZENDESK_ENV_TAG'),
  }),
})
