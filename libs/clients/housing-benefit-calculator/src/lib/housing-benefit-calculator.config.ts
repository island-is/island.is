import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  username: z.string(),
  password: z.string(),
  xRoadServicePath: z.string(),
})

export const HousingBenefitCalculatorClientConfig = defineConfig({
  name: 'HousingBenefitCalculatorClient',
  schema,
  load(env) {
    return {
      username: env.required('HOUSING_BENEFIT_CALCULATOR_USERNAME'),
      password: env.required('HOUSING_BENEFIT_CALCULATOR_PASSWORD'),
      xRoadServicePath: env.required(
        'XROAD_HOUSING_BENEFIT_CALCULATOR_PATH',
        'IS-DEV/GOV/10033/HMS-Protected/calc-v1',
      ),
    }
  },
})
