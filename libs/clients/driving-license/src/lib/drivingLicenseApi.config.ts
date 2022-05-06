import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadBaseUrl: z.string(),
  xroadClientId: z.string(),
  secret: z.string(),
  xroadPathV1: z.string(),
  xroadPathV2: z.string(),
  // fetchOptions: TODO
})

export const DrivingLicenseApiConfig = defineConfig({
  name: 'DrivingLicenseApi',
  schema,
  load(env) {
    return {
      // TODO set env variable names
      xroadBaseUrl: env.required('XROAD_BASE_PATH'),
      xroadClientId: env.required('XROAD_CLIENT_ID'),
      secret: env.required('XROAD_DRIVING_LICENSE_SECRET'),
      xroadPathV1: env.required('DRIVING_LICENSE_XROAD_PATH'),
      xroadPathV2: env.required('DRIVING_LICENSE_XROAD_PATH_V2'),
      // fetchOptions: TODO
    }
  },
})


// drivingLicense: {
//   clientConfig: {
//     secret: process.env.XROAD_DRIVING_LICENSE_SECRET,
//     xroadClientId: 'IS-DEV/GOV/10000/island-is-client',
//     xroadBaseUrl: process.env.XROAD_BASE_PATH ?? 'http://localhost:8081',
//     xroadPathV1:
//       'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
//     xroadPathV2:
//       'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2',
//   },
// },