import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  username: z.string(),
  password: z.string(),
})

export const VehiclesClientConfig = defineConfig({
  name: 'VehiclesApi',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'DRIVING_LICENSE_BOOK_XROAD_PATH',
        'IS-DEV:GOV:10017:Samgongustofa-Protected/Mitt-Svaedi-V1',
      ),
      fetch: {
        timeout: 10000, //env.optionalJSON('XROAD_DRIVING_LICENSE_BOOK_TIMEOUT') ??
      },
    }
  },
})
