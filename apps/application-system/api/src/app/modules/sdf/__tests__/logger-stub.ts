/// <reference types="jest" />

/**
 * A stand-in for the injected logger. `child` returns the same stub, as the
 * service creates a child logger, so calls made on it are visible to the test.
 */
export const createLoggerStub = () => {
  const logger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    child: jest.fn(),
  }
  logger.child.mockReturnValue(logger)
  return logger
}
