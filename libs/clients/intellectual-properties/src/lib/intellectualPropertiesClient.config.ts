import { IpOfficeScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const IntellectualPropertiesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IntellectualPropertiesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_INTELLECTUAL_PROPERTIES_PATH',
      'IS-DEV/GOV/10030/WebAPI-Public/HUG-webAPI',
    ),
    scope: [IpOfficeScope.ipScope],
  }),
})
