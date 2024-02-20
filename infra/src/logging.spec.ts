import { getLogger } from './logging'

describe('logging same level', () => {
  let logger
  beforeEach(() => {
    console.log = jest.fn()
  })
  it('should log error messages', () => {
    logger = getLogger('error')
    logger.error('test message')
    expect(console.log).toHaveBeenCalledWith('error: test message')
  })
  it('should log warn messages', () => {
    logger = getLogger('warn')
    logger.warn('test message')
    expect(console.log).toHaveBeenCalledWith('warn: test message')
  })
  it('should log info messages', () => {
    logger = getLogger('info')
    logger.info('test message')
    expect(console.log).toHaveBeenCalledWith('info: test message')
  })
  it('should log debug messages', () => {
    logger = getLogger('debug')
    logger.debug('test message')
    expect(console.log).toHaveBeenCalledWith('debug: test message')
  })
  it('should log silly messages', () => {
    logger = getLogger('silly')
    logger.silly('test message')
    expect(console.log).toHaveBeenCalledWith('silly: test message')
  })
})
