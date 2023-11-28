import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const InsurancePaymentsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'InsurancePaymentsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_INSURANCE_PAYMENTS_PATH',
        'IS-DEV/GOV/10008/TR-Protected/external-v1',
      ),
      scope: [''],
    }
  },
})
