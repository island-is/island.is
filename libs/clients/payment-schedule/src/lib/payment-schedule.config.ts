import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetchTimeout: z.number().int(),
  tokenExchangeScope: z.array(z.string()),
  requestActorToken: z.boolean(),
})

export const PaymentScheduleClientConfig = defineConfig({
  name: 'PaymentScheduleClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_PAYMENT_SCHEDULE_PATH',
        'IS-DEV/GOV/10021/FJS-Public/paymentSchedule_v1',
      ),
      fetchTimeout: env.optionalJSON('XROAD_PAYMENT_SCHEDULE_TIMEOUT') ?? 50000,
      tokenExchangeScope: env.optionalJSON('XROAD_PAYMENT_SCHEDULE_SCOPE') ?? [
        '@fjs.is/finance',
        // TODO: Remove when fjs has migrated to the scope above.
        'api_resource.scope',
      ],
      requestActorToken:
        env.optionalJSON('XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN') ?? false,
    }
  },
})
