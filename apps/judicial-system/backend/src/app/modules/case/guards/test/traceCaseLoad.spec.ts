import tracer from 'dd-trace'

import {
  CASE_LOAD_GUARD_TAG,
  CASE_LOAD_INCLUDE_TAG,
  CASE_LOAD_ROUTE_TAG,
  CASE_LOAD_SPAN,
  caseLoadRoute,
  traceCaseLoad,
} from '../traceCaseLoad'

jest.mock('dd-trace')

describe('traceCaseLoad', () => {
  const mockTrace = tracer.trace as jest.Mock
  const request = { method: 'PATCH', route: { path: '/api/case/:caseId' } }

  beforeEach(() => {
    mockTrace.mockImplementation((_name, _options, fn) => fn())
  })

  it('runs the load in a span named after the guard, tagged with the include and the route', async () => {
    const theCase = { id: 'case-id' }
    const load = jest.fn().mockResolvedValue(theCase)

    const result = await traceCaseLoad('CaseExistsGuard', 'case', request, load)

    expect(result).toBe(theCase)
    expect(load).toHaveBeenCalledTimes(1)
    expect(mockTrace).toHaveBeenCalledWith(
      CASE_LOAD_SPAN,
      {
        resource: 'CaseExistsGuard',
        tags: {
          [CASE_LOAD_GUARD_TAG]: 'CaseExistsGuard',
          [CASE_LOAD_INCLUDE_TAG]: 'case',
          [CASE_LOAD_ROUTE_TAG]: 'PATCH /api/case/:caseId',
        },
      },
      load,
    )
  })

  it('uses the name the agent stores, with an underscore', () => {
    expect(CASE_LOAD_SPAN).toBe('judicial_system.case_load')
  })

  it('lets the load error through', async () => {
    const error = new Error('not found')

    await expect(
      traceCaseLoad('CaseExistsGuard', 'case', request, () =>
        Promise.reject(error),
      ),
    ).rejects.toBe(error)
  })

  describe('caseLoadRoute', () => {
    it('is the method and the route pattern', () => {
      expect(caseLoadRoute(request)).toBe('PATCH /api/case/:caseId')
    })

    it('falls back to the path when no route matched', () => {
      expect(caseLoadRoute({ method: 'GET', path: '/api/case/abc' })).toBe(
        'GET /api/case/abc',
      )
    })

    it('is empty for a request with neither', () => {
      expect(caseLoadRoute({})).toBe('')
    })
  })
})
