import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  applicationEmailSubject: z.string(),
  zendeskTagProduct: z.string(),
  zendeskEnvTag: z.string(),
})

export const HHCoursesConfig = defineConfig({
  name: 'HHCoursesConfig',
  schema,
  load: (env) => ({
    applicationEmailSubject: env.required('HH_COURSES_ZENDESK_SUBJECT'),
    zendeskTagProduct:
      env.optional('HH_COURSES_ZENDESK_TAG_PRODUCT') ?? 'hh_namskeid',
    zendeskEnvTag: env.required('HH_COURSES_ZENDESK_ENV_TAG'),
  }),
})
