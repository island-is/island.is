import { createLogger, format, transports } from 'winston'
import { SentryTransport } from './transports'
import { utilities } from 'nest-winston'

// Default log settings for debug mode
let logLevel = 'debug'
let logFormat = format.combine(
  format.timestamp(),
  utilities.format.nestLike('App'),
)

// Production overrides
if (process.env.NODE_ENV === 'production') {
  logLevel = process.env.LOG_LEVEL || 'info'
  logFormat = format.combine(format.timestamp(), format.json())
}

export const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: [new transports.Console(), new SentryTransport()],
})
