import { logger, withLoggingContext } from '@island.is/logging'
import { CodeOwners } from '@island.is/shared/constants'
import tracer from 'dd-trace'

/**
 * Sets a code owner for the current dd-trace span and all nested log entries.
 *
 * The assumption here is that each trace / request has only one "dynamic"
 * code owner. This way we skip cluttering the trace with extra spans.
 */
export const withCodeOwner = <R, TArgs extends unknown[]>(
  codeOwner: CodeOwners,
  callback: (...args: TArgs) => R,
  ...args: TArgs
) => {
  const span = tracer.scope().active()
  if (span) {
    span.setTag('codeOwner', codeOwner)
  } else if (process.env.NODE_ENV !== 'development') {
    logger.warn(
      `Setting code owner "${codeOwner}" with no active dd-trace span`,
    )
  }

  return withLoggingContext({ codeOwner }, callback, ...args)
}
