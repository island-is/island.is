const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export class Logger {
  trace = ['trace'].includes(LOG_LEVEL) ? console.trace : () => {}
  debug = ['debug', 'trace'].includes(LOG_LEVEL) ? console.debug : () => {}
  log = console.log
  info = console.info
  warn = console.warn
  error = console.error
}
export const logger = new Logger()
