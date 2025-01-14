import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const JudicialSystemSPClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'JudicialSystemSPClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_JUDICIAL_SYSTEM_SP_PATH',
        'IS-DEV/GOV/10014/Rettarvorslugatt-Private/judicial-system-mailbox-api',
      ),
      scope: ['@rettarvorslugatt.island.is/law-and-order'],
    }
  },
})
