import { defineConfig } from '@island.is/nest/config'
import { MMSScope } from '@island.is/auth/scopes'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
  keyInfoScope: z.array(z.string()),
})

export const FriggClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FriggApi',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_MMS_FRIGG_PATH',
      'IS-DEV/GOV/10066/MMS-Protected/frigg-form-api',
    ),
    // Scopes for the general Frigg endpoints (FriggApi). This token is also
    // exchanged by the application-system, whose IDS client is only granted
    // nemendagrunnur, so nothing else may be added here.
    scope: [MMSScope.nemendagrunnur],
    // Scopes for the Mínar síður key-info endpoints (MnarSurApi), which only
    // the api runs. Every scope here must be registered with IDS *and* granted
    // to the calling client: IDS rejects the whole token request with
    // `invalid_scope` if any one of them is not, taking the reads down along
    // with the writes. See the add-mms-student-info-read-scope-to-client seeder.
    keyInfoScope: [
      MMSScope.nemendagrunnur,
      MMSScope.studentInfoRead,
      MMSScope.studentHealthRead,
      MMSScope.studentInfoModify,
      MMSScope.studentHealthModify,
    ],
  }),
})
