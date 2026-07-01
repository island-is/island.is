import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.array(z.string()),
})

export const NationalAgencyForChildrenAndFamiliesClientConfig = defineConfig({
  name: 'NationalAgencyForChildrenAndFamiliesApi',
  schema,
  load(env) {
    return {
      baseUrl: env.required('BARNAVERND_API_URL'),
      clientId: env.required('BARNAVERND_API_CLIENT_ID'),
      clientSecret: env.required('BARNAVERND_API_CLIENT_SECRET'),
      scope: env.optionalJSON('BARNAVERND_API_SCOPE') ?? [],
    }
  },
})
