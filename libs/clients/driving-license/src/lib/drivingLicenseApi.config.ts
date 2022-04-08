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
      xroadBaseUrl: env.required(''),
      xroadClientId: env.required(''),
      secret: env.required(''),
      xroadPathV1: env.required(''),
      xroadPathV2: env.required(''),
      // fetchOptions: TODO
    }
  },
})
