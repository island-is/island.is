import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})

export const FinancialManagementAuthorityClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'FinancialManagementAuthorityClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FINANCIAL_MANAGEMENT_AUTHORITY_PATH',
      'IS-DEV/GOV/10021/FJS-Protected/recruitment-v1',
    ),
    username: env.required('FINANCIAL_MANAGEMENT_AUTHORITY_USERNAME'),
    password: env.required('FINANCIAL_MANAGEMENT_AUTHORITY_PASSWORD'),
  }),
})
