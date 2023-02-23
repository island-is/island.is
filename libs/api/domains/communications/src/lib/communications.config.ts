import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  hsnWebFormResponseUrl: z.string(),
  hsnWebFormResponseSecret: z.string(),
  hsnWebFormId: z.string(),
})

export const CommunicationsConfig = defineConfig({
  name: 'Communications',
  schema,
  load: (env) => ({
    hsnWebFormResponseUrl: env.required('HSN_WEB_FORM_RESPONSE_URL'),
    hsnWebFormResponseSecret: env.required('HSN_WEB_FORM_RESPONSE_SECRET'),
    hsnWebFormId: env.required('HSN_WEB_FORM_ID'),
  }),
})
