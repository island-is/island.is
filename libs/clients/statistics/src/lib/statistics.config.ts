import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  sourceDataPaths: z.string(),
})

export const StatisticsClientConfig = defineConfig({
  name: 'StatisticsClientConfig',
  schema,
  load(env) {
    return {
      sourceDataPaths: env.required('CHART_STATISTIC_SOURCE_DATA_PATHS'),
    }
  },
})
