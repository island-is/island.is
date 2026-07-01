import {
  Configuration,
  ExternalDropdownApi,
  ExternalNotificationApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const apiProviders = [
  ExternalDropdownApi,
  ExternalNotificationApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
