import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const RskKilometragjaldReimbursementClientConfig = defineConfig({
  name: 'RskKilometragjaldReimbursementClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_RSK_KILOMETRAGJALD_REIMBURSEMENT_PATH',
      'IS-DEV/GOV/10006/Skatturinn/Kilometragjald-reimbursement',
    ),
  }),
})
