import tracer from 'dd-trace'

import { withTraceContext } from './traceContext'

jest.mock('dd-trace')

describe('withTraceContext', () => {
  const span = { context: jest.fn() }
  const mockInject = tracer.inject as jest.Mock
  let activeSpan: typeof span | null

  beforeEach(() => {
    activeSpan = span
    ;(tracer.scope as jest.Mock).mockImplementation(() => ({
      active: () => activeSpan,
    }))
    mockInject.mockClear()
    mockInject.mockImplementation((_span, _format, carrier) => {
      carrier['x-datadog-trace-id'] = '123'
      carrier['x-datadog-parent-id'] = '456'
    })
  })

  it('adds the trace headers next to the request headers', () => {
    const result = withTraceContext({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer token',
      },
    })

    expect(mockInject).toHaveBeenCalledWith(
      span,
      'http_headers',
      expect.anything(),
    )
    expect(result.method).toBe('PATCH')

    const headers = result.headers as Headers
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('authorization')).toBe('Bearer token')
    expect(headers.get('x-datadog-trace-id')).toBe('123')
    expect(headers.get('x-datadog-parent-id')).toBe('456')
  })

  it('returns the options untouched without an active span', () => {
    activeSpan = null
    const options = { headers: { 'Content-Type': 'application/json' } }

    expect(withTraceContext(options)).toBe(options)
    expect(mockInject).not.toHaveBeenCalled()
  })
})
