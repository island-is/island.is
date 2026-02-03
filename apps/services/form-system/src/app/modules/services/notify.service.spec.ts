import { NotifyService } from './notify.service'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

// Mock the middleware factory so we can control the returned fetch
jest.mock('@island.is/clients/middlewares', () => ({
  createEnhancedFetch: jest.fn(),
}))

// Minimal ApplicationDto stub
const applicationDto = {
  id: 'app-123',
  slug: 'test-type',
} as any

// Common logger mock
const makeLogger = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
})

// Common configs
const defaultXRoadConfig = {
  xRoadBasePath: 'https://xroad.dev01',
  xRoadClient: 'IS-DEV/GOV/CLIENT',
} as any

const defaultSyslumennConfig = {
  username: 'user',
  password: 'pass',
} as any

// Response-like helper
const okResponse = (overrides: Partial<Response> = {}) =>
  ({
    ok: true,
    status: 200,
    json: async () => ({}),
    ...overrides,
  } as any)

const notOkResponse = (status = 500) =>
  ({
    ok: false,
    status,
    json: async () => ({}),
  } as any)

describe('NotifyService', () => {
  let mockFetch: jest.Mock

  beforeEach(() => {
    mockFetch = jest.fn()
    ;(createEnhancedFetch as jest.Mock).mockReturnValue(mockFetch)
    jest.clearAllMocks()
  })

  const makeService = (overrides?: {
    xRoad?: Partial<typeof defaultXRoadConfig>
    syslumenn?: Partial<typeof defaultSyslumennConfig>
    logger?: ReturnType<typeof makeLogger>
  }) => {
    const xRoad = { ...defaultXRoadConfig, ...(overrides?.xRoad || {}) } as any
    const syslumenn = {
      ...defaultSyslumennConfig,
      ...(overrides?.syslumenn || {}),
    } as any
    const logger = overrides?.logger ?? makeLogger()
    const service = new NotifyService(xRoad, syslumenn, logger as any)
    return { service, logger }
  }

  it('initializes enhancedFetch via factory with proper options', () => {
    const { service } = makeService()
    expect(createEnhancedFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'form-system-notify-service',
        organizationSlug: 'stafraent-island',
        timeout: 40000,
        logErrorResponseBody: true,
      }),
    )
    expect(typeof service.enhancedFetch).toBe('function')
    expect(service.enhancedFetch).toBe(mockFetch)
  })

  it('throws when X-Road config is missing (xroadBase or xroadClient)', async () => {
    const { service } = makeService({ xRoad: { xRoadBasePath: '' } })
    await expect(
      service.sendNotification(applicationDto, 'any/url'),
    ).rejects.toThrow('X-Road configuration is missing')

    const { service: service2 } = makeService({ xRoad: { xRoadClient: '' } })
    await expect(
      service2.sendNotification(applicationDto, 'any/url'),
    ).rejects.toThrow('X-Road configuration is missing')
  })

  it('sendNotification succeeds without token and sets X-Road headers', async () => {
    const { service, logger } = makeService()
    mockFetch.mockResolvedValueOnce(okResponse())

    const result = await service.sendNotification(applicationDto, 'foo/bar')
    expect(result).toBe(true)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [calledUrl, options] = mockFetch.mock.calls[0]
    expect(calledUrl).toContain('/r1/foo/bar')
    expect(options.method).toBe('POST')
    expect(options.headers['X-Road-Client']).toBe(
      defaultXRoadConfig.xRoadClient,
    )
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.headers.Authorization).toBeUndefined()

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Sending notification to URL'),
    )
  })

  it('sendNotification includes Authorization when url contains syslumenn-protected', async () => {
    const { service } = makeService()
    // Mock token acquisition path
    const tokenSpy = jest
      .spyOn<any, any>(service as any, 'getSyslumennAccessToken')
      .mockResolvedValue('token-abc')

    mockFetch.mockResolvedValueOnce(okResponse())

    const result = await service.sendNotification(
      applicationDto,
      'syslumenn-protected/notify',
    )
    expect(result).toBe(true)

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer token-abc')
    expect(options.headers['X-Road-Client']).toBe(
      defaultXRoadConfig.xRoadClient,
    )

    tokenSpy.mockRestore()
  })

  it('returns false and logs on non-OK HTTP response', async () => {
    const { service, logger } = makeService()
    mockFetch.mockResolvedValueOnce(notOkResponse(500))

    const result = await service.sendNotification(applicationDto, 'foo/bar')
    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Non-OK response'),
    )
  })

  it('returns false and logs when fetch throws', async () => {
    const { service, logger } = makeService()
    mockFetch.mockRejectedValueOnce(new Error('network fail'))

    const result = await service.sendNotification(applicationDto, 'foo/bar')
    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error sending notification'),
    )
  })

  it('returns false and logs when token acquisition fails', async () => {
    const { service, logger } = makeService()
    const tokenSpy = jest
      .spyOn<any, any>(service as any, 'getSyslumennAccessToken')
      .mockRejectedValue(new Error('token acquisition failed'))

    const result = await service.sendNotification(
      applicationDto,
      'syslumenn-protected/path',
    )
    expect(result).toBe(false)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error acquiring access token'),
    )

    tokenSpy.mockRestore()
  })

  describe('getSyslumennAccessToken', () => {
    it('throws when environment cannot be determined', async () => {
      const { service } = makeService()
      await expect(
        service['getSyslumennAccessToken']('unknown-org' as any),
      ).rejects.toThrow('Could not determine environment')
    })

    it('succeeds and returns accessToken when login ok', async () => {
      const logger = makeLogger()
      const { service } = makeService({ logger })

      mockFetch.mockResolvedValueOnce(
        okResponse({ json: async () => ({ accessToken: 'xyz-123' }) }),
      )

      const token = await service['getSyslumennAccessToken'](
        'syslumenn-protected',
      )
      expect(token).toBe('xyz-123')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [loginUrl] = mockFetch.mock.calls[0]
      expect(loginUrl).toContain('/r1/IS-DEV/GOV/10016/Syslumenn-Protected')
    })

    it('throws when login response is non-OK', async () => {
      const { service } = makeService()
      mockFetch.mockResolvedValueOnce(notOkResponse(401))

      await expect(
        service['getSyslumennAccessToken']('syslumenn-protected'),
      ).rejects.toThrow('Syslumenn login failed')
    })

    it('throws when accessToken missing in response', async () => {
      const { service } = makeService()
      mockFetch.mockResolvedValueOnce(okResponse({ json: async () => ({}) }))

      await expect(
        service['getSyslumennAccessToken']('syslumenn-protected'),
      ).rejects.toThrow('Syslumenn login response missing accessToken')
    })

    it('logs and rethrows on fetch error', async () => {
      const { service, logger } = makeService()
      mockFetch.mockRejectedValueOnce(new Error('network fail'))

      await expect(
        service['getSyslumennAccessToken']('syslumenn-protected'),
      ).rejects.toThrow('network fail')
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error during Syslumenn login'),
      )
    })
  })
})
