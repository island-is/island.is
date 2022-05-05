import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  baseApiUrl: z.string(),
})

export const MunicipalitiesFinancialAidConfig = defineConfig({
  name: 'MunicipalitiesFinancialAidConfig',
  schema,
  load(env) {
    return {
      baseApiUrl: env.required(
        'MUNICIPALITIES_FINANCIAL_AID_BACKEND_URL',
        'http://localhost:3344',
      ),
    }
  },
})
