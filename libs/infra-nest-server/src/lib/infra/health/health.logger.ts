import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

/**
 * Creating a new logger used for health checks to use our winston
 * wrapper and remove coloring of the default Terminus logger.
 */

@Injectable({ scope: Scope.TRANSIENT })
export class HealthLogger extends ConsoleLogger {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super()
  }

  error(message: unknown, stack?: string, context?: string): void
  error(message: unknown, ...optionalParams: unknown[]): void
  error(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: any,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    this.logger.error(message, stack, context, ...rest)
  }
}
