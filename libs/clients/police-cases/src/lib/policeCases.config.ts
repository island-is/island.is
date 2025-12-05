import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  xRoadPoliceCasesApiKey: z.string(),
})

export const PoliceCasesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PoliceCasesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_POLICE_CASES_PATH',
      'IS-DEV/GOV/10005/Logreglan-Protected/MittLogreglanApi-v1',
    ),
    xRoadPoliceCasesApiKey: env.required('RLS_CASES_API_KEY', ''),
  }),
})
