import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  rvkVeitaClientId: z.string(),
  rvkVeitaClientSecret: z.string(),
  rvkVeitaAuthTokenEndpoint: z.string(),
  rvkVeitaAuthScope: z.string(),
  rvkVeitaAuthHeaderName: z.string(),
})

export const RvkFinancialAidConfig = defineConfig({
  name: 'RvkFinancialAidConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_RVK_VEITA_PATH',
        'IS-DEV/MUN/10025/rvik-veita-protected/veita-v1',
      ),
      rvkVeitaClientId: env.required('RVK_VEITA_CLIENT_ID', ''),
      rvkVeitaClientSecret: env.required('RVK_VEITA_CLIENT_SECRET', ''),
      rvkVeitaAuthTokenEndpoint: env.required(
        'RVK_VEITA_AUTH_TOKEN_ENDPOINT',
        'https://login.microsoftonline.com/6aed0be3-a6ff-4c6c-83b5-bb72bdd10088/oauth2/v2.0/token',
      ),
      rvkVeitaAuthScope: env.required(
        'RVK_VEITA_AUTH_SCOPE',
        'api://veita-api.test.reykjavik.is/.default',
      ),
      rvkVeitaAuthHeaderName: env.required(
        'RVK_VEITA_AUTH_HEADER_NAME',
        'X-Client-Authorization',
      ),
    }
  },
})
