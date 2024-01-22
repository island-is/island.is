import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
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
  }),
})
