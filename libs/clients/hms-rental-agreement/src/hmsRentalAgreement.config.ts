import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const HmsRentalAgreementClientConfig = defineConfig({
  name: 'HmsRentalAgreementClientConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_HMS_RENTAL_SERVICE_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/Leigusamningar-v1',
      ),
      xRoadClientHeader: env.required(
        'XROAD_HMS_RENTAL_SERVICE_CLIENT_HEADER',
        'IS-DEV/GOV/10000/island-is-client',
      ),
    }
  },
})
