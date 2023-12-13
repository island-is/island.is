export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

const logLevelEnv = (process.env.LOG_LEVEL ?? 'info').toLowerCase()
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
  )[logLevelEnv] ?? 'info'

export class Logger {
  readonly logLevel = LOG_LEVEL
  log = (level: LogLevel, ...args: any[]) => this._logger(level)(...args)
  trace = this._logger('trace')
  debug = this._logger('debug')
  info = this._logger('info')
  warn = this._logger('warn')
  error = this._logger('error')

  // Returns a function that logs at the correct level
  private _logger(level: LogLevel) {
    const l2l = {
      trace: 0,
      debug: 10,
      info: 20,
      warn: 30,
      error: 40,
    }
    if (l2l[level] >= l2l[this.logLevel]) {
      return console[level]
    }
    return () => {}
  }
}
export const logger = new Logger()
