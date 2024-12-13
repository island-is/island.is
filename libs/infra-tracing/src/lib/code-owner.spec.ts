import { withCodeOwner } from './code-owner'
import { CodeOwners } from '@island.is/shared/constants'
import { logger, withLoggingContext } from '@island.is/logging'
import tracer from 'dd-trace'

jest.mock('dd-trace')
jest.mock('@island.is/logging')

describe('withCodeOwner', () => {
  let mockSpan: { setTag: jest.Mock }
  let mockScope: jest.Mock

  beforeEach(() => {
    mockSpan = {
      setTag: jest.fn(),
    }
    mockScope = jest.fn(() => ({
      active: () => mockSpan,
    }))
    ;(tracer.scope as jest.Mock) = mockScope
    ;(logger.warn as jest.Mock).mockClear()
    ;(withLoggingContext as jest.Mock).mockImplementation(
      (_, callback, ...args) => callback(...args),
    )
  })

  it('should set code owner tag on active span and call the callback', () => {
    // Arrange
    const mockCallback = jest.fn()
    const mockArgs = ['arg1', 'arg2']

    // Act
    withCodeOwner(CodeOwners.Core, mockCallback, ...mockArgs)

    // Assert
    expect(mockSpan.setTag).toHaveBeenCalledWith('codeOwner', CodeOwners.Core)
    expect(withLoggingContext).toHaveBeenCalledWith(
      { codeOwner: CodeOwners.Core },
      mockCallback,
      ...mockArgs,
    )
    expect(mockCallback).toHaveBeenCalledWith(...mockArgs)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('should log warning when no active span exists and still call the callback', () => {
    // Arrange
    mockScope = jest.fn(() => ({
      active: () => null,
    }))
    ;(tracer.scope as jest.Mock) = mockScope
    const mockCallback = jest.fn()
    const mockArgs = ['arg1', 'arg2']

    // Act
    withCodeOwner(CodeOwners.Core, mockCallback, ...mockArgs)

    // Assert
    expect(logger.warn).toHaveBeenCalledWith(
      'Setting code owner "core" with no active dd-trace span',
    )
    expect(withLoggingContext).toHaveBeenCalledWith(
      { codeOwner: CodeOwners.Core },
      mockCallback,
      ...mockArgs,
    )
    expect(mockCallback).toHaveBeenCalledWith(...mockArgs)
  })

  it('should return the callback result', () => {
    // Arrange
    const expectedResult = { foo: 'bar' }
    const mockCallback = jest.fn().mockReturnValue(expectedResult)

    // Act
    const result = withCodeOwner(CodeOwners.Core, mockCallback)

    // Assert
    expect(result).toBe(expectedResult)
  })
})
