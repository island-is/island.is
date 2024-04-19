import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const OfficialJournalOfIcelandClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'OfficialJournalOfIcelandClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_OFFICIAL_JOURNAL_PATH',
      'IS-DEV/GOV/10014/DMR-Protected/official-journal',
    ),
    fetch: {
      timeout: 10000,
      scope: [],
    },
  }),
})
