import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { AosahScope } from '@island.is/auth/scopes'

const schema = z.object({
    xRoadServicePath: z.string(),
    fetch: z.object({
      timeout: z.number().int(),
    }),
    scope: z.array(z.string()),
  })

  export const AosahClientConfig = defineConfig<z.infer<typeof schema>>({
    name: 'aosahClient',
    schema,
    load(env) {
      return {
        xRoadServicePath: env.required(
          'XROAD_AOSAH_PATH',
          'IS-DEV/GOV/10000/island-is-client',
        ),
        fetch: {
          timeout: 30000,
        },
        scope: [AosahScope.aosah], 
      }
    }
  })
    // load(env) {
    //     return {
    //         xroadServicePath: env.required(
    //             'XROAD_AOSAH_PATH',
    //             'r1/IS-DEV/GOV/10013/Vinnueftirlitid-Protected/vinnuvelar-token',//IS-DEV/GOV/10000/island-is-client
    //         ),
    //     fetch: {
    //         timeout: 30000,
    //     },
    //     scope: [AosahScope.aosah], // TODO: Change to new scope when it has been created
    //   }
    // }
 
