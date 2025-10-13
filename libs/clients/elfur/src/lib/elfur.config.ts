import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  scope: z.array(z.string()),
  basePath: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  apiUsernameKey: z.string()
})

export const ElfurClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'ElfurClient',
  schema,
  load(env) {
    return {
      basePath: env.required('ELFUR_BASE_PATH', 'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net'),
      clientId: env.required('ELFUR_CLIENT_ID', '@fjs.is/hugsmidjan'),
      clientSecret: env.required('ELFUR_CLIENT_SECRET', ''),
      apiUsernameKey: env.required('ELFUR_API_USERNAME_KEY', ''),
      scope: ['@fjs.is/elfur_employee_read', '@fjs.is/elfur_organization_read'],
    }
  },
})
