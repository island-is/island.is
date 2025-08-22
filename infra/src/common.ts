import { spawn } from 'child_process'
import { rootDir } from './dsl/consts'

export async function runCommand({
  command,
  cwd = rootDir,
  project = '',
  projectNameSize = 25,
  dryRun = false,
}: {
  command: string | string[]
  cwd?: string
  project?: string
  projectNameSize?: number
  dryRun?: boolean
}) {
  if (!Array.isArray(command)) {
    command = [command]
  }
  const projectLabel = `${project
    .padEnd(projectNameSize, ' ')
    .slice(0, projectNameSize)} `
  const logMessage = (message: string) => `${projectLabel} - ${message}`
  if (dryRun) {
    logger.info(logMessage(`[DRY RUN] ${command.join(' ')}`))
    return spawn('true')
  }
  const proc = spawn(command.join(' '), [], {
    cwd,
    shell: true,
    stdio: 'pipe',
  })
  logger.debug('Process started', { proc, cwd, command })
  proc.stdout?.on('data', (data: Buffer | string) => {
    data
      .toString()
      .split(/\r?\n|\r|\n/g)
      .forEach((line: string) => {
        logger.info(logMessage(line.trim()))
      })
  })
  proc.stderr?.on('data', (data) => {
    data
      .toString()
      .split('\n')
      .forEach((line: string) => {
        if (line.trim().length > 0) {
          logger.error(logMessage(line))
        }
      })
  })
  return proc
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error'

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
      return console.error
      // return console[level]
    }
    return () => {}
  }
}
export const logger = new Logger()
