import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  apiKey: z.string(),
  scope: z.array(z.string()),
})

export const BloodClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'BloodClientConfig',
  schema,
  load(env) {
    return {
      baseUrl: env.required(
        'XROAD_LSH_PATH',
        'IS-DEV/GOV/10022/Landspitali-Protected/external-patient-api-v1',
      ),
      apiKey: env.required('LSH_BLOOD_API_KEY', ''),
      scope: ['@landspitali.is/patientdata:read'],
    }
  },
})
