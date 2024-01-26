import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { NationalRegistryScope } from '@island.is/auth/scopes'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
  scopeAdmin: z.array(z.string()),
  scopeManager: z.array(z.string()),
  clientId: z.string(),
})

export const SignatureCollectionClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'SignatureCollectionClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_SIGNATURE_COLLECTION_PATH',
      'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Medmaeli-v1',
    ),
    scope: [NationalRegistryScope.signatureCollection],
    scopeAdmin: [NationalRegistryScope.signatureCollectionProcess],
    scopeManager: [NationalRegistryScope.signatureCollectionProcess],
    clientId: '@island.is/clients/api',
  }),
})
