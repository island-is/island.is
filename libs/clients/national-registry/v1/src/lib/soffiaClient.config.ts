import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseSoapUrl: z.string(),
  user: z.string(),
  password: z.string(),
  host: z.string(),
})

export const NationalRegistrySoffiaClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'NationalRegistrySoffiaClientConfig',
  schema,
  load(env) {
    return {
      baseSoapUrl: env.required('SOFFIA_SOAP_URL', 'https://localhost:8443'),
      user: env.required('SOFFIA_USER', ''),
      password: env.required('SOFFIA_PASS', ''),
      host: env.required('SOFFIA_HOST_URL', 'soffiaprufa.skra.is'),
    }
  },
})
