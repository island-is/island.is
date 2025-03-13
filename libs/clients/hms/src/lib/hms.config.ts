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
        'http://localhost:8081/IS-TEST/GOV/5812191480/HMS-Protected/IS-TEST/r1/GOV/5501692829/test-client/fasteignir-v2-beta',
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

// Header:X-Road-Client
// Prod:/IS/GOV/5501692829/island-is-client/
// Stg:/is-test/GOV/5501692829/test-client/

// Prófuðum þessa slóð til að tengjast en fengum villu:
// http://localhost:8081/r1/GOV/5501692829/test-client/fasteignir-v2-beta/api/stadfang/search?partialStadfang=su

// {
//   "name": "FetchError",
//   "url": "http://localhost:8081/r1/GOV/5501692829/test-client/fasteignir-v2-beta/api/stadfang/search?partialStadfang=su",
//   "status": 500,
//   "headers": { },
//   "statusText": "Server Error",
//   "body": {
//   "type": "Server.ClientProxy.InternalError",
//   "message": "Shared params for instance identifier GOV not found",
//   "detail": "7e7267a8-a9d8-42d7-b846-b1b09b8468f1"
//   },
//   "stack": "FetchError: Request failed with status code 500\n
//        at Function.<anonymous> (/Users/hebaulfarsdottir/Projects/Kolibri/island.is/dist/apps/api/webpack:/libs/clients/middlewares/src/lib/FetchError.ts:30:19)\n
//        at Generator.next (<anonymous>)\n
//        at /Users/hebaulfarsdottir/Projects/Kolibri/island.is/node_modules/tslib/tslib.js:169:75\n
//        at new Promise (<anonymous>)\n
//        at Object.__awaiter (/Users/hebaulfarsdottir/Projects/Kolibri/island.is/node_modules/tslib/tslib.js:165:16)\n
//        at Function.build (/Users/hebaulfarsdottir/Projects/Kolibri/island.is/dist/apps/api/main.js:4346:24)\n
//        at /Users/hebaulfarsdottir/Projects/Kolibri/island.is/dist/apps/api/webpack:/libs/clients/middlewares/src/lib/withResponseErrors.ts:19:30\n
//        at Generator.next (<anonymous>)\n    at fulfilled (/Users/hebaulfarsdottir/Projects/Kolibri/island.is/node_modules/tslib/tslib.js:166:62)\n
//        at processTicksAndRejections (node:internal/process/task_queues:105:5)",
//   "fetch": {
//   "name": "clients-hms"
//   }
// }

// https://securityserver.staging01.devland.is/IS-TEST/GOV/5812191480/HMS-Protected/IS-TEST/r1/GOV/5501692829/test-client/fasteignir-v2-beta/
// https://securityserver.island.is/IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/IS/GOV/5501692829/island-is-client/Fasteignir-v2/

// http://localhost:8081/r1/ISGOV/5501692829/island-is-client/fasteignir-v2-beta/api/stadfang/search?partialStadfang=sun

// https://securityserver.staging01.devland.is/IS-TEST/GOV/5812191480/HMS-Protected/IS-TEST/r1/GOV/5501692829/test-client/fasteignir-v2-beta/
