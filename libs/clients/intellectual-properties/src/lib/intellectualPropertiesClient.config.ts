import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  apiKey: z.string(),
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const IntellectualPropertiesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IntellectualPropertiesClient',
  schema,
  load(env) {
    return {
      apiKey: env.required('INTELLECTUAL_PROPERTY_API_KEY', ''),
      xRoadServicePath: env.required(
        'XROAD_INTELLECTUAL_PROPERTIES_PATH',
        'IS-DEV/GOV/10030/WebAPI-Public/HUG-webAPI',
      ),
      scope: ['@hugverk.is/ip'],
    }
  },
})
