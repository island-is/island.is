import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  basePath: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  authUrl: z.string().url(),
})

export const ElfurClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'ElfurClient',
  schema,
  load(env) {
    return {
      authUrl: env.required(
        'ELFUR_BASE_IDS_URL',
        'https://identity-server.staging01.devland.is',
      ),
      basePath: env.required(
        'ELFUR_BASE_PATH',
        'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net',
      ),
      clientId: env.required('ELFUR_CLIENT_ID', '@fjs.is/stafraent-island-api-elfur'),
      clientSecret: env.required('ELFUR_CLIENT_SECRET', ''),
    }
  },
})
