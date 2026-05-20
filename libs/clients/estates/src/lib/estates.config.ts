import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  // TODO: add syslumenn.is/danarbu scope once available
  scope: z.array(z.string()),
})

export const EstatesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'EstatesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ESTATES_PATH',
      'IS-DEV/GOV/10016/Syslumenn-Protected/islandisestatepages',
    ),
    // TODO: add syslumenn.is/danarbu scope once available
    scope: [],
  }),
})
