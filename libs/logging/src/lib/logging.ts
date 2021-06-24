import { createLogger, format, LoggerOptions, transports } from 'winston'
import { utilities } from 'nest-winston'

import { SentryTransport } from './transports'
import { removeNationalIds } from './remove-national-ids'

// Default log settings for debug mode
let logLevel = 'debug'
let logFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  utilities.format.nestLike('App'),
  removeNationalIds(),
)

// Production overrides
if (process.env.NODE_ENV === 'production') {
  logLevel = process.env.LOG_LEVEL || 'info'
  logFormat = format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
    removeNationalIds(),
  )
}

const logTransports = [new transports.Console(), new SentryTransport()]

export const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: logTransports,
  handleExceptions: true,
  exitOnError: true,
  exceptionHandlers: logTransports,
  rejectionHandlers: logTransports,
} as LoggerOptions)
