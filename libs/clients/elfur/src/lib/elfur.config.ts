import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  basePath: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  apiUsernameKey: z.string(),
})

export const ElfurClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'ElfurClient',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'ELFUR_BASE_PATH',
        'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net',
      ),
      clientId: env.required('ELFUR_CLIENT_ID', '@fjs.is/hugsmidjan'),
      clientSecret: env.required('ELFUR_CLIENT_SECRET', ''),
      apiUsernameKey: env.required('ELFUR_USERNAME_KEY', ''),
    }
  },
})
