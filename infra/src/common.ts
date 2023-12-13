export class Logger {
  trace = console.trace
  debug = console.debug
  log = console.log
  info = console.info
  warn = console.warn
  error = console.error
}
export const logger = new Logger()
