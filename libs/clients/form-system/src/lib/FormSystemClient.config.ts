import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const FormSystemClientConfig = defineConfig({
  name: 'FormSystemApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'FORM_SYSTEM_API_BASE_PATH',
        'https://profun.island.is/umsoknarkerfi',
      ),
    }
  },
})
