import { includeContextFormatter, withLoggingContext } from './context'

describe('Winston context', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should add context to log info object', () => {
    // Arrange
    const formatter = includeContextFormatter()
    const logInfo = {
      level: 'info',
      message: 'Test message',
    }
    const context = { requestId: '123', userId: '456' }

    // Act
    let formattedLog: unknown
    withLoggingContext(context, () => {
      formattedLog = formatter.transform(logInfo)
    })

    // Assert
    expect(formattedLog).toEqual({
      level: 'info',
      message: 'Test message',
      requestId: '123',
      userId: '456',
    })
  })

  it('should not modify log info when no context exists', () => {
    // Arrange
    const formatter = includeContextFormatter()
    const logInfo = {
      level: 'info',
      message: 'Test message',
    }

    // Act
    const formattedLog = formatter.transform(logInfo)

    // Assert
    expect(formattedLog).toEqual(logInfo)
  })

  it('should preserve existing log info properties when adding context', () => {
    // Arrange
    const formatter = includeContextFormatter()
    const logInfo = {
      level: 'info',
      message: 'Test message',
      existingProp: 'should remain',
    }
    const context = { requestId: '123' }

    // Act
    let formattedLog: unknown
    withLoggingContext(context, () => {
      formattedLog = formatter.transform(logInfo)
    })

    // Assert
    expect(formattedLog).toEqual({
      level: 'info',
      message: 'Test message',
      existingProp: 'should remain',
      requestId: '123',
    })
  })
})
