import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  applicationRecipientEmail: z.string(),
  applicationSenderName: z.string(),
  applicationSenderEmail: z.string(),
  applicationEmailSubject: z.string(),
})

export const HHCoursesConfig = defineConfig({
  name: 'HHCoursesConfig',
  schema,
  load: (env) => ({
    applicationRecipientEmail: env.required('HH_ZENDESK_CONTACT_FORM_EMAIL'),
    applicationSenderName: env.required('EMAIL_FROM_NAME'),
    applicationSenderEmail: env.required('EMAIL_FROM'),
    applicationEmailSubject: env.required('HH_COURSES_ZENDESK_SUBJECT'),
  }),
})
