import tracer from 'dd-trace'

import {
  CASE_LOAD_GUARD_TAG,
  CASE_LOAD_INCLUDE_TAG,
  CASE_LOAD_SPAN,
  traceCaseLoad,
} from '../traceCaseLoad'

jest.mock('dd-trace')

describe('traceCaseLoad', () => {
  const mockTrace = tracer.trace as jest.Mock
  let activeSpan: { addTags: jest.Mock } | null

  beforeEach(() => {
    activeSpan = { addTags: jest.fn() }
    ;(tracer.scope as jest.Mock).mockImplementation(() => ({
      active: () => activeSpan,
    }))
    mockTrace.mockImplementation((_name, _options, fn) => fn())
  })

  it('runs the load in a span named after the guard and tagged with the include', async () => {
    const theCase = { id: 'case-id' }
    const load = jest.fn().mockResolvedValue(theCase)

    const result = await traceCaseLoad('CaseExistsGuard', 'case', load)

    expect(result).toBe(theCase)
    expect(load).toHaveBeenCalledTimes(1)
    expect(mockTrace).toHaveBeenCalledWith(
      CASE_LOAD_SPAN,
      {
        resource: 'CaseExistsGuard',
        tags: {
          [CASE_LOAD_GUARD_TAG]: 'CaseExistsGuard',
          [CASE_LOAD_INCLUDE_TAG]: 'case',
        },
      },
      load,
    )
  })

  it('tags the request span with the guard and the include', async () => {
    await traceCaseLoad('MinimalCaseExistsGuard', 'minimal', () =>
      Promise.resolve(undefined),
    )

    expect(activeSpan?.addTags).toHaveBeenCalledWith({
      [CASE_LOAD_GUARD_TAG]: 'MinimalCaseExistsGuard',
      [CASE_LOAD_INCLUDE_TAG]: 'minimal',
    })
  })

  it('still loads when there is no active span', async () => {
    activeSpan = null
    const theCase = { id: 'case-id' }

    const result = await traceCaseLoad('CaseExistsGuard', 'case', () =>
      Promise.resolve(theCase),
    )

    expect(result).toBe(theCase)
  })

  it('lets the load error through', async () => {
    const error = new Error('not found')

    await expect(
      traceCaseLoad('CaseExistsGuard', 'case', () => Promise.reject(error)),
    ).rejects.toBe(error)
  })
})
