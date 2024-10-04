import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  url: z.optional(z.string()),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  username: z.string(),
  password: z.string(),
  xRoadServicePath: z.optional(z.string()),
})

export const SyslumennClientConfig = defineConfig({
  name: 'SyslumennApi',
  schema,
  load(env) {
    return {
      url: env.optional('SYSLUMENN_HOST', 'https://api.syslumenn.is/staging'),
      fetch: {
        timeout: env.optionalJSON('SYSLUMENN_TIMEOUT') ?? 40000,
      },
      username: env.required('SYSLUMENN_USERNAME', ''),
      password: env.required('SYSLUMENN_PASSWORD', ''),
      xRoadServicePath: env.optional(
        'XROAD_DISTRICT_COMMISSIONERS_WORK_SYSTEM_PATH',
        'r1/IS-DEV/GOV/10016/Syslumenn-Protected/StarfsKerfi',
      ),
    }
  },
})
