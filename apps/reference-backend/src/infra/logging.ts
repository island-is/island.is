import { createLogger, format, transports } from 'winston'

// Default log settings for debug mode
let logLevel = 'debug'
let logFormat = format.combine(format.colorize(), format.simple())

// Production overrides
if (process.env.NODE_ENV === 'production') {
  logLevel = 'info'
  logFormat = format.json()
}

export const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: [new transports.Console()],
})
