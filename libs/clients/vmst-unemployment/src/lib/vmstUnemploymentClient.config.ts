import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  username: z.string(),
  password: z.string(),
})

export const VmstUnemploymentClientConfig = defineConfig({
  name: 'VmstUnemploymentApi',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'DRIVING_LICENSE_BOOK_XROAD_PATH',
        'IS-DEV/GOV/10003/VMST-Protected',
      ),
      fetch: {
        timeout:
          env.optionalJSON('XROAD_DRIVING_LICENSE_BOOK_TIMEOUT') ?? 10000,
      },
      username: env.required('DRIVING_LICENSE_BOOK_USERNAME', ''),
      password: env.required('DRIVING_LICENSE_BOOK_PASSWORD', ''),
    }
  },
})
