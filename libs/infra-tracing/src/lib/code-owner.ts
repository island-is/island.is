import { logger } from '@island.is/logging'
import { CodeOwners } from '@island.is/shared/constants'
import tracer from 'dd-trace'

/**
 * Sets a code owner for the current dd-trace span.
 *
 * The assumption here is that each trace / request has only one "dynamic"
 * code owner. This way we skip cluttering the trace with extra spans.
 */
export const setCodeOwner = (codeOwner: CodeOwners) => {
  const span = tracer.scope().active()
  if (span) {
    span.setTag('codeOwner', codeOwner)
  } else {
    const stack = new Error().stack
    logger.warn(
      `Setting code owner "${codeOwner}" with no active dd-trace span`,
      { stack },
    )
  }
}
