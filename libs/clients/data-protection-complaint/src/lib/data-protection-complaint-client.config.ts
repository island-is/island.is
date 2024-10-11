import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  username: z.string(),
  password: z.string(),
  XRoadProviderId: z.string(),
})

export const DataProtectionComplaintClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DataProtectionComplaintClient',
  schema,
  load(env) {
    return {
      password: env.required('DATA_PROTECTION_COMPLAINT_API_PASSWORD', ''),
      username: env.required('DATA_PROTECTION_COMPLAINT_API_USERNAME', ''),
      XRoadProviderId: env.required(
        'DATA_PROTECTION_COMPLAINT_XROAD_PROVIDER_ID',
        '',
      ),
    }
  },
})
