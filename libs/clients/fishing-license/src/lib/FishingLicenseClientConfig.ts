import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { FishingLicenseScope } from '@island.is/auth/scopes'

const schema = z.object({
  scope: z.array(z.string()),
})

export const FishingLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FishingLicenseClient',
  schema,
  load(env) {
    return {
      scope: env.optionalJSON('XROAD_FISHING_LICENSE_SCOPE') ?? [
        FishingLicenseScope.fishingLicense,
      ],
    }
  },
})
