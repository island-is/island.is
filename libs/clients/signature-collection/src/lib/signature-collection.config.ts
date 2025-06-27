import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

export enum NationalRegistryScope {
  signatureCollection = '@skra.is/signature-collection',
  signatureCollectionProcess = '@skra.is/signature-collection:process',
  signatureCollectionManage = '@skra.is/signature-collection:manage',
  signatureCollectionMunicipality = '@skra.is/signature-collection:municipality',
}

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
  scopeAdmin: z.array(z.string()),
  scopeManager: z.array(z.string()),
  scopeMunicipality: z.array(z.string()),
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
    scopeManager: [NationalRegistryScope.signatureCollectionManage],
    scopeMunicipality: [NationalRegistryScope.signatureCollectionMunicipality],
    clientId: '@island.is/clients/api',
  }),
})
