import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { AoshScope } from '@island.is/auth/scopes'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const TransferOfMachineOwnershipClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'TransferOfMachineOwnershipClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_TRANSFER_MACHINE_OWNERSHIP_PATH',
        'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/vinnuvelar-token',
      ),
      scope: [AoshScope.aosh],
    }
  },
})
