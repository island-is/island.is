import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
  requestActorToken: z.boolean(),
})

export const BankInfoClientConfig = defineConfig({
  name: 'BankInfoClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FJS_BANKINFO_PATH',
      'IS-DEV/GOV/10021/FJS-Public/TBRBankMgrService_v1',
    ),
    fetchTimeout: env.optionalJSON('XROAD_FJS_BANKINFO_TIMEOUT') ?? 20000,
    tokenExchangeScope: env.optionalJSON('XROAD_FJS_BANKINFO_SCOPE') ?? [
      '@fjs.is/finance',
      // TODO: Remove when fjs has migrated to the scope above.
      'api_resource.scope',
    ],
    requestActorToken:
      env.optionalJSON('XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN') ?? false,
  }),
})
