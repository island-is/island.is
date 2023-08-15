import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
  Configuration,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration, logger: Logger) => {
    logger.debug(typeof Api)
    return new Api(configuration)
  },
  inject: [ApiConfig.provide, LOGGER_PROVIDER],
}))
