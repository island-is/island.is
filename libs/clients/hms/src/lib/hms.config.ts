import { HmsScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadPath: z.string(),
  xRoadClientHeader: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
})

export const HmsConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HmsClient',
  schema,
  load(env) {
    return {
      xRoadPath: env.required(
        'XROAD_HMS_PATH',
        // TODO: Change to correct x-road path
        'https://apifasteignirdev.icybay-64e3fde9.westeurope.azurecontainerapps.io',
        // 'http://localhost:8081/IS-TEST/GOV/5812191480/HMS-Protected/IS-TEST/r1/GOV/5501692829/test-client/fasteignir-v2-beta',
      ),
      xRoadClientHeader: env.required(
        'XROAD_HMS_CLIENT_HEADER',
        '/is-test/GOV/5501692829/test-client/',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PROPERTIES_TIMEOUT') ?? 15000,
      tokenExchangeScope: [HmsScope.housingBenefits],
    }
  },
})
