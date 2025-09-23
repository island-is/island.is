import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  username: z.string(),
  password: z.string(),
})

export const VmstUnemploymentClientConfig = defineConfig({
  name: 'VmstUnemploymentApi',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'VMST_UNEMPLOYMENT_XROAD_PATH',
        'IS-DEV/GOV/10003/VMST-Protected/XRoadDev-v1',
      ),
      fetch: {
<<<<<<< HEAD
        timeout: 20000,
=======
        timeout: 35000,
>>>>>>> 08871bed86 (changing to 35sec)
      },
      username: env.required('XROAD_VMST_UNEMPLOYMENT_USERNAME', ''),
      password: env.required('XROAD_VMST_UNEMPLOYMENT_PASSWORD', ''),
    }
  },
})
