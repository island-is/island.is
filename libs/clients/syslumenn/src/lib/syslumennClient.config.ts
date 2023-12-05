import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  url: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  username: z.string(),
  password: z.string(),
})

export const SyslumennClientConfig = defineConfig({
  name: 'SyslumennApi',
  schema,
  load(env) {
    return {
      url: env.required('SYSLUMENN_HOST', 'https://api.syslumenn.is/staging'),
      fetch: {
        timeout: env.optionalJSON('SYSLUMENN_TIMEOUT') ?? 40000,
      },
      username: env.required('SYSLUMENN_USERNAME'),
      password: env.required('SYSLUMENN_PASSWORD'),
    }
  },
})
