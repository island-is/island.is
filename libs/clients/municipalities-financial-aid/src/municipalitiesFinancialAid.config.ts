import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const MunicipalitiesFinancialAidConfig = defineConfig({
  name: 'MunicipalitiesFinancialAidConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_FINANCIAL_AID_BACKEND_SERVICE_PATH',
        'IS-DEV/MUN/10023/samband-sveitarfelaga/financial-aid-backend',
      ),
    }
  },
})

// const schema = z.object({
//   baseApiUrl: z.string(),
// })

// export const MunicipalitiesFinancialAidConfig = defineConfig({
//   name: 'MunicipalitiesFinancialAidConfig',
//   schema,
//   load(env) {
//     return {
//       baseApiUrl: env.required(
//         'MUNICIPALITIES_FINANCIAL_AID_BACKEND_URL',
//         'http://localhost:3344',
//       ),
//     }
//   },
// })
