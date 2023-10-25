import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
const schema = z.object({
  scope: z.array(z.string()),
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
      scope: env.optionalJSON('') ?? [''],
      xRoadServicePath: env.required(
        'ALTHINGI_OMBUDSMAN_XROAD_SERVICE_PATH',
        '',
      ),
      username: env.required('ALTHINGI_OMBUDSMAN_XROAD_USERNAME', ''),
      password: env.required('ALTHINGI_OMBUDSMAN_XROAD_PASSWORD', ''),
    }
  },
})
