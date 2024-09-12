import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const HealthDirectorateOrganDonationClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HealthDirectorateOrganDonationClientConfig',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_HEALTH_DIRECTORATE_ORGAN_DONATION_PATH',
        'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/organ-donation-v1',
      ),
      scope: ['@landlaeknir.is/organ-donations'],
    }
  },
})
