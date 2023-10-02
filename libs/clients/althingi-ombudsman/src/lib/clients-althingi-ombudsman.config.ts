import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
const schema = z.object({
  scope: z.array(z.string()),
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
  xRoadBaseUrl: z.string(),
  XRoadProviderId: z.string(),
  xRoadClientId: z.string(),
})

export const AlthingiOmbudsmanClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AlthingiOmbudsmanClient',
  schema,
  load(env) {
    return {
      scope: env.optionalJSON('') ?? [''],
      xRoadServicePath: '',
      // xRoadServicePath: env.required(''),
      // username: env.required(''),
      // password: env.required(''),
      // xRoadBaseUrl: env.required(''),
      // XRoadProviderId: env.required(''),
      // xRoadClientId: env.required(''),
      username: '',
      password: '',
      xRoadBaseUrl: '',
      XRoadProviderId: '',
      xRoadClientId: '',
    }
  },
})
