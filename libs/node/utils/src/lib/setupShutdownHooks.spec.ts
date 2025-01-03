import { setupShutdownHooks } from './setupShutdownHooks'
import { logger } from '@island.is/logging'
import { Server } from 'http'

// Mock the logger
jest.mock('@island.is/logging', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('setupShutdownHooks', () => {
  let server: Server
  let processExitSpy: jest.SpyInstance
  let processOnSpy: jest.SpyInstance

  beforeEach(() => {
    // Create a mock server
    server = {
      close: jest.fn((callback) => callback()),
    } as unknown as Server

    // Spy on process.exit and process.on
    processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never)
    processOnSpy = jest.spyOn(process, 'on')

    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks()
  })

  it('should set up event listeners for termination signals', () => {
    // Act
    setupShutdownHooks(server)

    // Assert
    expect(processOnSpy).toHaveBeenCalledWith('SIGHUP', expect.any(Function))
    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
  })

  it('should add disconnect event when NX_INVOKED_BY_RUNNER is true', () => {
    // Arrange
    process.env.NX_INVOKED_BY_RUNNER = 'true'

    // Act
    setupShutdownHooks(server)

    // Assert
    expect(processOnSpy).toHaveBeenCalledWith(
      'disconnect',
      expect.any(Function),
    )

    // Clean up
    process.env.NX_INVOKED_BY_RUNNER = undefined
  })

  it('should handle shutdown gracefully', async () => {
    // Arrange
    setupShutdownHooks(server)
    const handler = processOnSpy.mock.calls.find(
      ([event]) => event === 'SIGTERM',
    )[1]

    // Act
    await handler()

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      'Received SIGTERM, shutting down...',
    )
    expect(server.close).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('Server closed successfully')
    expect(processExitSpy).toHaveBeenCalledWith(0)
  })

  it('should handle server close errors', async () => {
    // Arrange
    const errorServer = {
      close: jest.fn(() => {
        throw new Error('Server close failed')
      }),
    } as unknown as Server
    setupShutdownHooks(errorServer)
    const [[, handler]] = processOnSpy.mock.calls

    // Act
    await handler()

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      'Error during shutdown:',
      expect.any(Error),
    )
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })

  it('should execute onShutdown callback during shutdown', async () => {
    // Arrange
    const onShutdownMock = jest.fn()
    setupShutdownHooks(server, onShutdownMock)
    const handler = processOnSpy.mock.calls.find(
      ([event]) => event === 'SIGTERM',
    )[1]

    // Act
    await handler()

    // Assert
    expect(onShutdownMock).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(
      'Received SIGTERM, shutting down...',
    )
    expect(server.close).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('Server closed successfully')
    expect(processExitSpy).toHaveBeenCalledWith(0)
  })

  it('should handle onShutdown rejection', async () => {
    // Arrange
    const onShutdownMock = jest
      .fn()
      .mockRejectedValue(new Error('Shutdown hook failed'))
    setupShutdownHooks(server, onShutdownMock)
    const handler = processOnSpy.mock.calls.find(
      ([event]) => event === 'SIGTERM',
    )[1]

    // Act
    await handler()

    // Assert
    expect(onShutdownMock).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      'Error during shutdown:',
      expect.any(Error),
    )
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })
})
