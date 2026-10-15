import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const RskKilometerFeeClientConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'RskKilometerFeeClientConfig',
    schema,
    load: (env) => ({
      xRoadServicePath: env.required(
        'XROAD_RSK_KILOMETER_FEE_PATH',
        'IS-DEV/GOV/10006/Skatturinn/Kilometragjald-kilometer-fee',
      ),
    }),
  },
)
