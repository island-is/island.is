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

export const DrivingLicenseBookClientConfig = defineConfig({
  name: 'DrivingLicenseBookApi',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'DRIVING_LICENSE_BOOK_XROAD_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Okunamsbok-V1',
      ),
      fetch: {
        timeout:
          env.optionalJSON('XROAD_DRIVING_LICENSE_BOOK_TIMEOUT') ?? 10000,
      },
      username: env.required('DRIVING_LICENSE_BOOK_USERNAME'),
      password: env.required('DRIVING_LICENSE_BOOK_PASSWORD'),
    }
  },
})
