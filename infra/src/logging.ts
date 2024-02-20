

export const LOG_LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'] as const
export const LOG_LEVEL = (process.env.LOG_LEVEL || 'warn') as typeof LOG_LEVELS[number]

export const logger = {
  ...LOG_LEVELS.reduce((acc, curr) => {
    acc[curr] = (message: string, ...rest: any) => LOG_LEVELS.indexOf(curr) <= LOG_LEVELS.indexOf(LOG_LEVEL) ? console.log(`${curr}: ${message}`, ...rest) : () => { }
    return acc
  }, {} as { [key in typeof LOG_LEVELS[number]]: (message: string, ...rest: any) => void }),
}
