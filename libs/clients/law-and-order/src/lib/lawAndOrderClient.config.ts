import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  scope: z.array(z.string()),
})

export const LawAndOrderClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'LawAndOrderClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_LAW_AND_ORDER_PATH',
        'IS-DEV/GOV/10014/Rettarvorslugatt-Private/judicial-system-mailbox-api',
      ),
      fetch: {
        timeout: 30000,
      },
      scope: [], // TODO: Change to new scope when it has been created
    }
  },
})
