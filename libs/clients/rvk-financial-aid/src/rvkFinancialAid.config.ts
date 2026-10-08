import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  // rvkVeitaClientId: z.string(),
  // rvkVeitaClientSecret: z.string(),
  // rvkVeitaBaseUrl: z.string(),
  // rvkVeitaAuthTokenEndpoint: z.string(),
  // rvkVeitaAuthScope: z.string(),
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
      // rvkVeitaClientId: env.required('RVK_VEITA_CLIENT_ID', ''),
      // rvkVeitaClientSecret: env.required('RVK_VEITA_CLIENT_SECRET', ''),
      // rvkVeitaBaseUrl: env.required(
      //   'RVK_VEITA_BASE_URL',
      //   'https://app-sdg-api-test-swe-01-eudeebgxashkhvhx.swedencentral-01.azurewebsites.net/veita-api/islandis/application',
      // ),
      // rvkVeitaAuthTokenEndpoint: env.required(
      //   'RVK_VEITA_AUTH_TOKEN_ENDPOINT',
      //   'https://login.microsoftonline.com/6aed0be3-a6ff-4c6c-83b5-bb72bdd10088/oauth2/v2.0/token',
      // ),
      // rvkVeitaAuthScope: 'api://veita-api.test.reykjavik.is/.default',
    }
  },
})
