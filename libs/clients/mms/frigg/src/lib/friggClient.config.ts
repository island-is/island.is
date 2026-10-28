import { defineConfig } from '@island.is/nest/config'
import { MMSScope } from '@island.is/auth/scopes'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const FriggClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FriggApi',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_MMS_FRIGG_PATH',
      'IS-DEV/GOV/10066/MMS-Protected/frigg-form-api',
    ),
    // Every scope here must be registered with IDS: it rejects the whole token
    // request with `invalid_scope` if any one of them is not, which would take
    // the reads down along with the writes.
    scope: [
      MMSScope.nemendagrunnur,
      MMSScope.studentInfoRead,
      MMSScope.studentHealthRead,
      MMSScope.studentInfoModify,
      MMSScope.studentHealthModify,
    ],
  }),
})
