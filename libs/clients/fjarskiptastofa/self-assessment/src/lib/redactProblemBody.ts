import type { Logger } from '@island.is/logging'

/**
 * Wraps a logger so that the `problem` field is left out of every log entry.
 *
 * Enhanced fetch logs the thrown FetchError as it is, and FetchError parses an
 * `application/problem+json` error response onto `error.problem` whether or not
 * `logErrorResponseBody` is set. Fjarskiptastofa answers a failed request with
 * problem+json (validation problems quote the fields that failed), so the
 * self-assessment answers could end up in the logs through that field.
 */
export const redactProblemBody = (logger: Logger): Logger =>
  new Proxy(logger, {
    get(target, property) {
      if (property !== 'log') {
        return Reflect.get(target, property, target)
      }

      // The log method is overloaded (level + message, a log entry, ...), so
      // the arguments are passed on as they came in, with only the problem
      // field of an entry object removed.
      const log = target.log.bind(target) as (...args: unknown[]) => Logger

      return (...args: unknown[]) =>
        log(
          ...args.map((arg) =>
            isLogEntry(arg) && 'problem' in arg
              ? { ...arg, problem: undefined }
              : arg,
          ),
        )
    },
  })

const isLogEntry = (entry: unknown): entry is Record<string, unknown> =>
  typeof entry === 'object' && entry !== null
