import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadApiPath: z.string(),
  xroadAuthPath: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
})

export const NationalAgencyForChildrenAndFamiliesClientConfig = defineConfig({
  name: 'NationalAgencyForChildrenAndFamiliesApi',
  schema,
  load(env) {
    return {
      xroadApiPath: env.required(
        'XROAD_NATIONAL_AGENCY_FOR_CHILDREN_AND_FAMILIES_API_PATH',
        'IS-DEV/GOV/10077/BOFS-Protected/bvg-digital-iceland',
      ),
      xroadAuthPath: env.required(
        'XROAD_NATIONAL_AGENCY_FOR_CHILDREN_AND_FAMILIES_AUTH_PATH',
        'IS-DEV/GOV/10077/BOFS-Protected/bvg-auth',
      ),
      clientId: env.required(
        'NATIONAL_AGENCY_FOR_CHILDREN_AND_FAMILIES_CLIENT_ID',
      ),
      clientSecret: env.required(
        'NATIONAL_AGENCY_FOR_CHILDREN_AND_FAMILIES_CLIENT_SECRET',
      ),
    }
  },
})
