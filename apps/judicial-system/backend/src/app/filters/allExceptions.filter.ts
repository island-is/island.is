import { Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    super()
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception.getStatus() < 500) {
      this.logger.info(exception)
    } else {
      this.logger.error(exception)
    }

    super.catch(exception, host)
  }
}
