import tracer from 'dd-trace'

import { BackendService } from './backend.service'

jest.mock('dd-trace')

// Every call to the backend goes through callBackend, so one request is
// enough to pin that the trace context travels with the forwarded headers.
describe('BackendService', () => {
  const config = {
    backendUrl: 'http://backend',
    secretToken: 'secret',
  }
  const fetchMock = jest.fn()

  beforeEach(() => {
    global.fetch = fetchMock
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'case-id' }),
    })
    ;(tracer.scope as jest.Mock).mockImplementation(() => ({
      active: () => ({}),
    }))
    ;(tracer.inject as jest.Mock).mockImplementation(
      (_span, _format, carrier) => (carrier['x-datadog-trace-id'] = '123'),
    )
  })

  it('sends the trace context along with the forwarded auth headers', async () => {
    const service = new BackendService(
      config as never,
      {
        req: { headers: { authorization: 'Bearer user-token' } },
      } as never,
    )

    await service.getCase('case-id')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    const headers = options.headers as Headers

    expect(url).toBe('http://backend/api/case/case-id')
    expect(headers.get('authorization')).toBe('Bearer user-token')
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('x-datadog-trace-id')).toBe('123')
  })
})
