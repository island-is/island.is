import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
})

export const LyfjastofnunPharmaciesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'LyfjastofnunPharmaciesClientConfig',
  schema,
  load: (env) => ({
    basePath: env.required(
      'LYFJASTOFNUN_PHARMACIES_BASE_URL',
      'https://api.serlyfjaskra.is',
    ),
  }),
})
