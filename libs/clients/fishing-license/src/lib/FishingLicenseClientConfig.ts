import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { FishingLicenseScope } from '@island.is/auth/scopes'

const schema = z.object({
  scope: z.array(z.string()),
  xRoadServicePath: z.string(),
})

export const FishingLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FishingLicenseClient',
  schema,
  load(env) {
    return {
      scope: env.optionalJSON('XROAD_FISHING_LICENSE_SCOPE') ?? [
        FishingLicenseScope.fishingLicense,
      ],
      xRoadServicePath: env.required(
        'FISHING_LICENSE_XROAD_PROVIDER_ID',
        'IS-DEV/GOV/10012/Fiskistofa-Protected/veidileyfi-v1',
      ),
    }
  },
})
