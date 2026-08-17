import { HttpStatus } from '@nestjs/common'
import { ProblemType } from '@island.is/shared/problem'
import { ProblemError, ProblemOptions } from './ProblemError'

export class GatewayTimeout extends ProblemError {
  constructor(timeoutMs: number, options?: ProblemOptions) {
    super(
      {
        type: ProblemType.GATEWAY_TIMEOUT,
        title: 'Gateway Timeout',
        status: HttpStatus.GATEWAY_TIMEOUT,
        detail: `Request timeout exceeded (over ${timeoutMs}ms)`,
      },
      options,
    )
  }
}
