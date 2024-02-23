import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
  tokenExchangeScope: z.array(z.string()),
})

export const FormSystemClientConfig = defineConfig({
  name: 'FormSystemApi',
  schema,
  load(env) {
    return {
      basePath: env.required('https://profun.island.is/umsoknarkerfi/api'),
      tokenExchangeScope: ['api_resource.scope'], // TODO: add correct scope
    }
  },
})
