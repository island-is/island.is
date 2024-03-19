import { logger, LOGGER_PROVIDER } from '@island.is/logging'

export const LoggerProvider = {
  provide: LOGGER_PROVIDER,
  useValue: logger,
}
