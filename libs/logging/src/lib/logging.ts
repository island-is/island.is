import { createLogger, format, LoggerOptions, transports } from 'winston'
import { utilities } from 'nest-winston'
import tracer from '@island.is/infra-tracing'
import { maskNationalIdFormatter } from './formatters'
// Default log settings for debug mode

tracer.init({ logInjection: true })
const correlateFormat = format((info) => {
  const span = tracer.scope().active()
  if (span) {
    info.dd = {
      trace_id: span.context().toTraceId(),
      span_id: span.context().toSpanId(),
    }
  }
  return info
})
let logLevel = 'debug'
let logFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  utilities.format.nestLike('App'),
  maskNationalIdFormatter(),
  correlateFormat(),
)

// Production overrides
if (process.env.NODE_ENV === 'production') {
  logLevel = process.env.LOG_LEVEL || 'info'
  logFormat = format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
    maskNationalIdFormatter(),
    correlateFormat(),
  )
}

const logTransports = [new transports.Console()]
export const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: logTransports,
  handleExceptions: true,
  exitOnError: true,
  exceptionHandlers: logTransports,
  rejectionHandlers: logTransports,
} as LoggerOptions)
