/**
 * @jest-environment node
 *
 * The api routes themselves, which is where the two guards have to be wired
 * up: a lookup must reach the national registry only for an authenticated
 * caller asking for a national id that cannot carry query parameters of its
 * own. Specs cannot live under pages/, where next would compile them as
 * routes.
 */
import { sign } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'

import getBusinessesByNationalId from '../pages/api/nationalRegistry/getBusinessesByNationalId'
import getPersonByNationalId from '../pages/api/nationalRegistry/getPersonByNationalId'

// The routes answer with fakes under NODE_ENV=test, and these specs are about
// what they send to the registry.
jest.mock('../src/utils/nationalRegistryMock', () => ({
  shouldMockNationalRegistry: () => false,
}))

const secret = 'test-secret'

const buildResponse = () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  }

  return res as unknown as NextApiResponse & typeof res
}

const buildRequest = (nationalId?: string | string[], token?: string) =>
  ({
    query: nationalId === undefined ? {} : { nationalId },
    cookies: token ? { [ACCESS_TOKEN_COOKIE_NAME]: token } : {},
    headers: {},
  } as unknown as NextApiRequest)

const session = () => sign({ currentUserNationalId: '0101010101' }, secret)

const routes = [
  { name: 'getPersonByNationalId', handler: getPersonByNationalId },
  { name: 'getBusinessesByNationalId', handler: getBusinessesByNationalId },
]

describe.each(routes)('$name', ({ handler }) => {
  const originalEnv = process.env
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv, AUTH_JWT_SECRET: secret }
    delete process.env.ENVIRONMENT

    // The path endpoint answers with a bare record, which the route wraps.
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ kennitala: '0101010101' }),
    })
    global.fetch = fetchMock as unknown as typeof global.fetch
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should refuse an unauthenticated lookup', async () => {
    const res = buildResponse()

    await handler(buildRequest('0101010101'), res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should refuse a lookup authenticated with a forged token', async () => {
    const res = buildResponse()

    await handler(
      buildRequest(
        '0101010101',
        sign({ currentUserNationalId: '0101010101' }, 'forged'),
      ),
      res,
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should refuse a national id carrying another query parameter', async () => {
    const res = buildResponse()

    await handler(buildRequest('&name=ari&count=1000', session()), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should refuse a missing national id', async () => {
    const res = buildResponse()

    await handler(buildRequest(undefined, session()), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should refuse a repeated national id', async () => {
    const res = buildResponse()

    await handler(buildRequest(['0101010101', '&name=ari'], session()), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should look up an authenticated, valid national id by the path endpoint', async () => {
    const res = buildResponse()

    await handler(buildRequest('010101-0101', session()), res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    // The national id is in the path, not a query parameter, so it cannot carry
    // a query of its own.
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/0101010101$/)
    expect(fetchMock.mock.calls[0][0]).not.toContain('?')
  })

  it('should wrap the single record the path endpoint returns in a list', async () => {
    const res = buildResponse()

    await handler(buildRequest('0101010101', session()), res)

    expect(res.json).toHaveBeenCalledWith({
      items: [{ kennitala: '0101010101' }],
    })
  })

  it('should report nobody found as an empty list, not an error', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    })
    const res = buildResponse()

    await handler(buildRequest('0101010101', session()), res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ items: [] })
  })

  it('should answer a failed lookup with an error rather than an empty result', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    })
    const res = buildResponse()

    await handler(buildRequest('0101010101', session()), res)

    expect(res.status).toHaveBeenCalledWith(502)
    // The upstream error body must not reach the client as if it were a record.
    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({ items: expect.anything() }),
    )
  })
})
