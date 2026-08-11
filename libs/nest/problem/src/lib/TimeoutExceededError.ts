import { HttpStatus } from '@nestjs/common'
import { ProblemType } from '@island.is/shared/problem'
import { ProblemError, ProblemOptions } from './ProblemError'

export class TimeoutExceededError extends ProblemError {
  constructor(timeoutMs: number, options?: ProblemOptions) {
    super(
      {
        type: ProblemType.REQUEST_TIMEOUT,
        title: 'Request Timeout',
        status: HttpStatus.GATEWAY_TIMEOUT,
        detail: `Request timeout exceeded (over ${timeoutMs}ms)`,
      },
      options,
    )
  }
}
