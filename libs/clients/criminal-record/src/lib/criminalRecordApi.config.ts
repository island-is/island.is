import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
const schema = z.object({
  xRoadServicePath: z.string(),
})

export const CriminalRecordClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CriminalRecordClient',
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_CRIMINAL_RECORD_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/Sakavottord-PDF-v2',
      ),
    }
  },
})
