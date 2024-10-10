import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  subdomain: z.string(),
  formEmail: z.string(),
  formToken: z.string(),
})

export const ZendeskServiceConfig = defineConfig<z.infer<typeof schema>>({
  name: 'ZendeskServiceConfigurations',
  schema,
  load: (env) => ({
    subdomain: env.required('ZENDESK_CONTACT_FORM_SUBDOMAIN', 'digitaliceland'),
    formToken: env.required('ZENDESK_CONTACT_FORM_TOKEN'),
    formEmail: env.required(
      'ZENDESK_CONTACT_FORM_EMAIL',
      'stafraentisland@gmail.com',
    ),
  }),
})
