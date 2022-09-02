import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  cert: z.string(),
  passphrase: z.string(),
  basePath: z.string(),
})

export const IslykillClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'IslykillClient',
  schema,
  load(env) {
    return {
      cert: env.required('ISLYKILL_CERT'),
      passphrase: env.required('ISLYKILL_SERVICE_PASSPHRASE'),
      basePath: env.required('ISLYKILL_SERVICE_BASEPATH'),
    }
  },
})
