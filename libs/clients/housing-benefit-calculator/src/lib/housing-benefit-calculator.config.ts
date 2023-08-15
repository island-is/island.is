import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'

const schema = z.object({
  xRoadServicePath: z.string(),
  username: z.string(),
  password: z.string(),
})

export const HousingBenefitCalculatorClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'HousingBenefitCalculatorClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HOUSING_BENEFIT_CALCULATOR_PATH',
      'IS-DEV/GOV/10033/HMS-Protected/calc-v1',
    ),
    username: env.required('HOUSING_BENEFIT_CALCULATOR_USERNAME'),
    password: env.required('HOUSING_BENEFIT_CALCULATOR_PASSWORD'),
  }),
})

export const ApiConfig = {
  provide: 'HousingBenefitCalculator',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HousingBenefitCalculatorClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-housing-benefit-calculator',
        logErrorResponseBody: true,
        treat400ResponsesAsErrors: true,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      username: config.username,
      password: config.password,
    })
  },
  inject: [XRoadConfig.KEY, HousingBenefitCalculatorClientConfig.KEY],
}
