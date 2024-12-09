import { setCodeOwner } from './code-owner'
import { CodeOwners } from '@island.is/shared/constants'
import { logger } from '@island.is/logging'
import tracer from 'dd-trace'

jest.mock('dd-trace')
jest.mock('@island.is/logging')

describe('setCodeOwner', () => {
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
  })

  it('should set code owner tag on active span', () => {
    // Act
    setCodeOwner(CodeOwners.Core)

    // Assert
    expect(mockSpan.setTag).toHaveBeenCalledWith('codeOwner', CodeOwners.Core)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('should log warning when no active span exists', () => {
    // Arrange
    mockScope = jest.fn(() => ({
      active: () => null,
    }))
    ;(tracer.scope as jest.Mock) = mockScope

    // Act
    setCodeOwner(CodeOwners.Core)

    // Assert
    expect(logger.warn).toHaveBeenCalledWith(
      'Setting code owner "core" with no active dd-trace span',
      { stack: expect.any(String) },
    )
  })
})
