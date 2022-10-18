import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import { NoContentException } from './NoContentException'

@Catch(Error)
export class NoContentFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    if (error instanceof NoContentException) {
      const ctx = host.switchToHttp()
    }
  }
}
