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
  name: 'DocumentProviderDashboardApi',
  schema,
  load: (env) => ({
    clientId: env.required(
      'DOCUMENT_PROVIDER_DASHBOARD_CLIENTID',
      '802a6885c1d540aca3cbae799d61dd40',
    ),
    clientSecret: env.required('DOCUMENT_PROVIDER_DASHBOARD_CLIENT_SECRET', ''),
    scope: `${env.required(
      'DOCUMENT_PROVIDER_DASHBOARD_BASE_PATH',
      'https://test-providerdashboard-island-is.azurewebsites.net',
    )}/.default`,
    tokenUrl: env.required(
      'DOCUMENT_PROVIDER_DASHBOARD_TOKEN_URL',
      'https://test-identity-island-is.azurewebsites.net/connect/token',
    ),
    basePath: env.required(
      'DOCUMENT_PROVIDER_DASHBOARD_BASE_PATH',
      'https://test-providerdashboard-island-is.azurewebsites.net/',
    ),
  }),
})
