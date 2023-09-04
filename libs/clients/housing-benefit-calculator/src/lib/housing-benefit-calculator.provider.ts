import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { AuthenticateApi, Configuration, ReiknivelApi } from '../../gen/fetch'
import { HousingBenefitCalculatorClientConfig } from './housing-benefit-calculator.config'

export const ApiConfig = {
  provide: 'HousingBenefitCalculatorClientConfig',
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
      },
    })
  },
  inject: [XRoadConfig.KEY, HousingBenefitCalculatorClientConfig.KEY],
}

export const ApiProviders = [AuthenticateApi, ReiknivelApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
