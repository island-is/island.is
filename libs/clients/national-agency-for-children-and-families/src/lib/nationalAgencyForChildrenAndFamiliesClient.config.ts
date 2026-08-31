import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadApiPath: z.string(),
  xroadAuthPath: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.array(z.string()),
})

export const NationalAgencyForChildrenAndFamiliesClientConfig = defineConfig({
  name: 'NationalAgencyForChildrenAndFamiliesApi',
  schema,
  load(env) {
    return {
      xroadApiPath: env.required(
        'XROAD_BARNAVERND_API_PATH',
        'IS-DEV/GOV/10077/BOFS-Protected/bvg-digital-iceland',
      ),
      xroadAuthPath: env.required(
        'XROAD_BARNAVERND_AUTH_PATH',
        'IS-DEV/GOV/10077/BOFS-Protected/bvg-auth',
      ),
      clientId: env.required('BARNAVERND_API_CLIENT_ID'),
      clientSecret: env.required('BARNAVERND_API_CLIENT_SECRET'),
      scope: env.optionalJSON('BARNAVERND_API_SCOPE') ?? [],
    }
  },
})
