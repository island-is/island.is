import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const FishingLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FishingLicenseClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_FISHING_LICENSE_SERVICE_PATH',
        'UNKNOWN_AT_THIS_TIME', //TODO
      ),
    }
  },
})
