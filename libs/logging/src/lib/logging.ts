import { createLogger, format, LoggerOptions, transports } from 'winston'
import { utilities } from 'nest-winston'
import { includeContextFormatter } from './context'

import { maskNationalIdFormatter } from './formatters'

// Default log settings for debug mode
let logLevel = 'debug'
let logFormat = format.combine(
  format.errors({ stack: true, cause: true }),
  format.timestamp(),
  // Disable locally to reduce noise. Can be reconsidered.
  // includeContextFormatter(),
  utilities.format.nestLike('App'),
  maskNationalIdFormatter(),
)

// Production overrides
if (process.env.NODE_ENV === 'production') {
  logLevel = process.env.LOG_LEVEL || 'info'
  logFormat = format.combine(
    format.errors({ stack: true, cause: true }),
    format.timestamp(),
    includeContextFormatter(),
    format.json(),
    maskNationalIdFormatter(),
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
