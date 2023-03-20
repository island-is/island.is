import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const MunicipalitiesFinancialAidConfig = defineConfig({
  name: 'MunicipalitiesFinancialAidConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_FINANCIAL_AID_BACKEND_PATH',
        'IS-DEV/MUN/10023/samband-sveitarfelaga/financial-aid-backend',
      ),
    }
  },
})
