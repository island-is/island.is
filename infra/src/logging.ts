export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'
export const LOG_LEVELS = [
  'error',
  'warn',
  'info',
  'verbose',
  'debug',
  'silly',
] as const

const logLevelEnv = (
  process.env.LOG_LEVEL ??
  (process.env.DEBUG ? 'debug' : null) ??
  'info'
).toLowerCase()
export const LOG_LEVEL: LogLevel =
  (
    {
      trace: 'trace',
      debug: 'debug',
      info: 'info',
      warn: 'warn',
      warning: 'warn',
      error: 'error',
    } as const
  )[logLevelEnv] ?? 'warn'

import winston from 'winston'

// From https://www.npmjs.com/package/winston
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  defaultMeta: {},
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

// logger.level = 'warn'

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  )
}

export type Logger = typeof logger
