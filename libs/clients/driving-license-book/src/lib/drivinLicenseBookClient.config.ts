import { defineConfig } from '../../../../nest/config/src/lib/defineConfig'
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
  name: 'DrivingLicenseBookClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_DRIVING_LICENSE_BOOK_SERVICE_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Okunamsbok-V1',
      ),
      fetch: {
        timeout: env.optionalJSON('XROAD_DRIVING_LICENSE_BOOK_TIMEOUT') ?? 10000,
      },
      username: env.required('DRIVING_LICNESE_BOOK_USERNAME'),
      password: env.required('DRIVING_LICNESE_BOOK_PASSWORD'),
    }
  },
})
