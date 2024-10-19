import winston from 'winston'

const logLevelEnv = process.env.LOG_LEVEL?.toLowerCase() || 'info'
const logger = winston.createLogger({
  level: logLevelEnv,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const logMessage =
        typeof message === 'object' ? JSON.stringify(message, null, 2) : message
      // Stringify meta if it's an object and not empty
      const metaString =
        meta && Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''

      return `[${level}]: ${logMessage} ${metaString}`
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: logLevelEnv,
    }),
  ],
})

export { logger }
