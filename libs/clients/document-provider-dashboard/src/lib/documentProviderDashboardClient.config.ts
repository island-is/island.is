import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  scope: z.string(),
  tokenUrl: z.string(),
  basePath: z.string(),
})

export const DocumentProviderDashboardClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DocumentProviderDashboardApiClient',
  schema,
  load: (env) => ({
    clientId: env.required('DOCUMENT_PROVIDER_DASHBOARD_CLIENTID', ''),
    clientSecret: env.required('DOCUMENT_PROVIDER_DASHBOARD_CLIENT_SECRET', ''),
    scope: env.required('DOCUMENT_PROVIDER_DASHBOARD_SCOPE', ''),
    tokenUrl: env.required('DOCUMENT_PROVIDER_DASHBOARD_TOKEN_URL', ''),
    basePath: env.required('DOCUMENT_PROVIDER_DASHBOARD_BASE_PATH', ''),
  }),
})
