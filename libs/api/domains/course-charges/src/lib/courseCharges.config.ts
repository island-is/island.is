import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  zendeskSubjectPrefix: z.string(),
  zendeskSubdomain: z.string(),
  zendeskEmail: z.string(),
  zendeskToken: z.string(),
})

export const CourseChargesConfig = defineConfig({
  name: 'CourseChargesConfig',
  schema,
  load: (env) => ({
    zendeskSubjectPrefix: env.required('HH_COURSES_ZENDESK_SUBJECT'),
    zendeskSubdomain: env.required('HH_ZENDESK_SUBDOMAIN'),
    zendeskEmail: env.required('HH_ZENDESK_EMAIL'),
    zendeskToken: env.required('HH_ZENDESK_TOKEN'),
  }),
})
