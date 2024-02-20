export const LOG_LEVELS = [
  'error',
  'warn',
  'info',
  'verbose',
  'debug',
  'silly',
] as const
export const LOG_LEVEL = (process.env.LOG_LEVEL ||
  'warn') as typeof LOG_LEVELS[number]

export const getLogger = (logLevel = LOG_LEVEL) => ({
  ...LOG_LEVELS.reduce((acc, curr) => {
    acc[curr] = (message: string, ...rest: any) =>
      LOG_LEVELS.indexOf(curr) <= LOG_LEVELS.indexOf(logLevel)
        ? console.log(`${curr}: ${message}`, ...rest)
        : () => { }
    return acc
  }, {} as { [key in typeof LOG_LEVELS[number]]: (message: string, ...rest: any) => void }),
})
export const logger = getLogger()
