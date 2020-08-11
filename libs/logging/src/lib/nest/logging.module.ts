import { Global, LoggerService, Module } from '@nestjs/common'
export { Logger } from 'winston'
import { logger } from '../logging'
import { WinstonLogger } from 'nest-winston'

export const LOGGER_PROVIDER = 'Logger'

@Global()
@Module({
  providers: [{ provide: LOGGER_PROVIDER, useValue: logger }],
  exports: [{ provide: LOGGER_PROVIDER, useValue: logger }],
})
export class LoggingModule {
  static createLogger(): LoggerService {
    return new WinstonLogger(logger)
  }
}
