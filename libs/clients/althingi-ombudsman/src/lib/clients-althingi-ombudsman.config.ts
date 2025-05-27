import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})

export const AlthingiOmbudsmanClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'AlthingiOmbudsmanClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_ALTHINGI_OMBUDSMAN_SERVICE_PATH',
        'IS-DEV/GOV/10047/UA-Protected/kvortun-v1',
      ),
      username: env.required('ALTHINGI_OMBUDSMAN_XROAD_USERNAME', ''),
      password: env.required('ALTHINGI_OMBUDSMAN_XROAD_PASSWORD', ''),
    }
  },
})
