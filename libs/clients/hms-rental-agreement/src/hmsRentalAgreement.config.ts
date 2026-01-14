import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  xRoadClientHeader: z.string(),
  authClientId: z.string(),
  authClientSecret: z.string(),
  authTokenEndpoint: z.string(),
  authTenantId: z.string(),
})

export const HmsRentalAgreementClientConfig = defineConfig({
  name: 'HmsRentalAgreementClientConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_HMS_RENTAL_SERVICE_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/Leigusamningar-v1',
      ),
      xRoadClientHeader: env.required(
        'XROAD_HMS_RENTAL_SERVICE_CLIENT_HEADER',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      authClientId: env.required(
        'HMS_CONTRACTS_AUTH_CLIENT_ID',
        'e2411f5c-436a-4c17-aa14-eab9c225bc06',
      ),
      authClientSecret: env.required('HMS_CONTRACTS_AUTH_CLIENT_SECRET', ''),
      authTokenEndpoint: env.required(
        'HMS_CONTRACTS_AUTH_TOKEN_ENDPOINT',
        'https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token',
      ),
      authTenantId: env.required(
        'HMS_CONTRACTS_AUTH_TENANT_ID',
        'c7256472-2622-417e-8955-a54eeb0a110e',
      ),
    }
  },
})
