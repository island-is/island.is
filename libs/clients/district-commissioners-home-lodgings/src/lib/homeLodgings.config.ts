import { DistrictCommissionersScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const DistrictCommissionersHomeLodgingsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DistrictCommissionersHomeLodgingsClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH',
      'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
    ),
    // Sýslumenn have no dedicated home lodging scope; the IslandMinarSidur
    // service accepts any token exchanged for one of its scopes.
    scope: [DistrictCommissionersScope.pCardScope],
  }),
})
