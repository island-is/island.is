import { Configuration, DefaultApi } from '../../gen/fetch'
import { CustomsCalculatorApiConfiguration } from './apiConfiguration'

export const exportedApis = [DefaultApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [CustomsCalculatorApiConfiguration.provide],
}))
