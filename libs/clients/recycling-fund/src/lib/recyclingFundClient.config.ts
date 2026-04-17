import { defineConfig } from '@island.is/nest/config'
import { RecyclingFundScope } from '@island.is/auth/scopes'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const RecyclingFundClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RecyclingFundClientConfig',
  schema,
  load: (env) => ({
    /*xRoadServicePath: env.required(
      'XROAD_RECYCLING_FUND_PATH',
      'IS-TEST/GOV/5308033680/Urvinnslusjodur-Client',
    ),*/
    xRoadServicePath: env.required(
      'XROAD_RECYCLING_FUND_PATH',
      'IS-DEV/GOV/10099/Urvinnslusjodur-Client',
    ),
    scope: [RecyclingFundScope.carRecycling],
  }),
})
