import { GOOGLE_PAY_ROOT_KEYS_URLS } from './googlePay.constants'
import { fetchGooglePayRootKeys } from './googlePayRootKeys'

const KEYS = [
  {
    keyValue: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE',
    protocolVersion: 'ECv2',
    keyExpiration: '2154841200000',
  },
]

describe('fetchGooglePayRootKeys', () => {
  const originalFetch = global.fetch
  let fetchMock: jest.Mock

  const respondWith = ({
    ok = true,
    status = 200,
    body = { keys: KEYS } as unknown,
    cacheControl = null as string | null,
  }) => {
    fetchMock = jest.fn().mockResolvedValue({
      ok,
      status,
      json: async () => body,
      headers: new Headers(
        cacheControl ? { 'cache-control': cacheControl } : {},
      ),
    })
    global.fetch = fetchMock as never
  }

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("fetches the environment's URL and returns the keys with Google's max-age", async () => {
    respondWith({ cacheControl: 'public, max-age=86400, must-revalidate' })

    const result = await fetchGooglePayRootKeys('TEST')

    expect(fetchMock).toHaveBeenCalledWith(
      GOOGLE_PAY_ROOT_KEYS_URLS.TEST,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result).toEqual({ keys: KEYS, maxAgeMs: 86_400_000 })
  })

  it('falls back to an hour when the response has no max-age', async () => {
    respondWith({})

    const result = await fetchGooglePayRootKeys('PRODUCTION')

    expect(fetchMock).toHaveBeenCalledWith(
      GOOGLE_PAY_ROOT_KEYS_URLS.PRODUCTION,
      expect.anything(),
    )
    expect(result.maxAgeMs).toBe(3_600_000)
  })

  it('throws on a non-OK response', async () => {
    respondWith({ ok: false, status: 503 })

    await expect(fetchGooglePayRootKeys('TEST')).rejects.toThrow(
      '[stage=fetch] HTTP 503',
    )
  })

  it('throws on an unexpected body', async () => {
    respondWith({ body: { keys: [{ keyValue: 1 }] } })

    await expect(fetchGooglePayRootKeys('TEST')).rejects.toThrow(
      '[stage=parse]',
    )
  })
})
