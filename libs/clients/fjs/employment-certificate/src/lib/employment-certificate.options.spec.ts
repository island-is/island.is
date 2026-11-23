import { EmploymentCertificateClientConfig } from './employment-certificate.config'
import { getEmploymentCertificateClientOptions } from './employment-certificate.options'

type Params = Parameters<typeof getEmploymentCertificateClientOptions>

const config = (overrides: Partial<Params[0]> = {}): Params[0] => ({
  isConfigured: true,
  xRoadServicePath: undefined,
  directBaseUrl: undefined,
  tokenExchangeScope: [],
  fetchTimeout: 20000,
  ...overrides,
})

const xroadConfig: Params[1] = {
  isConfigured: true,
  xRoadBasePath: 'http://localhost:8081',
  xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
}

const idsClientConfig = {
  isConfigured: true,
  issuer: 'https://identity-server.test',
  clientId: 'test-client',
  clientSecret: 'test-secret',
} as Params[2]

const idsClientNotConfigured = { isConfigured: false } as Params[2]

describe('getEmploymentCertificateClientOptions', () => {
  describe('base URL', () => {
    it('goes through X-Road when the service path is set', () => {
      const options = getEmploymentCertificateClientOptions(
        config({ xRoadServicePath: 'IS-DEV/GOV/1/Test-Protected/test-v1' }),
        xroadConfig,
        idsClientConfig,
      )

      expect(options.baseUrl).toBe(
        'http://localhost:8081/r1/IS-DEV/GOV/1/Test-Protected/test-v1',
      )
      expect(options.headers).toEqual({
        Accept: 'application/json',
        'X-Road-Client': 'IS-DEV/GOV/10000/island-is-client',
      })
    })

    it('prefers the direct URL and then sends no X-Road header', () => {
      const options = getEmploymentCertificateClientOptions(
        config({
          directBaseUrl: 'https://api.test/',
          xRoadServicePath: 'IS-DEV/GOV/1/Test-Protected/test-v1',
        }),
        xroadConfig,
        idsClientConfig,
      )

      expect(options.baseUrl).toBe('https://api.test')
      expect(options.notConfiguredReason).toBeUndefined()
      expect(options.headers).toEqual({ Accept: 'application/json' })
    })

    it.each(['http://localhost:3999', 'http://127.0.0.1:3999/'])(
      'accepts the unencrypted direct URL %s on the same machine',
      (directBaseUrl) => {
        const options = getEmploymentCertificateClientOptions(
          config({ directBaseUrl }),
          xroadConfig,
          idsClientConfig,
        )

        expect(options.baseUrl).toBe(directBaseUrl.replace(/\/$/, ''))
        expect(options.notConfiguredReason).toBeUndefined()
      },
    )

    it.each([
      'http://api.test',
      'http://localhost.api.test',
      'ftp://api.test',
      'api.test',
    ])(
      'refuses the direct URL %s, also when X-Road is configured',
      (directBaseUrl) => {
        const options = getEmploymentCertificateClientOptions(
          config({
            directBaseUrl,
            xRoadServicePath: 'IS-DEV/GOV/1/Test-Protected/test-v1',
          }),
          xroadConfig,
          idsClientConfig,
        )

        expect(options.baseUrl).toBeUndefined()
        expect(options.notConfiguredReason).toBe(
          'the direct URL must use https',
        )
      },
    )

    it('has no base URL when nothing is configured', () => {
      const options = getEmploymentCertificateClientOptions(
        config(),
        xroadConfig,
        idsClientConfig,
      )

      expect(options.baseUrl).toBeUndefined()
      expect(options.notConfiguredReason).toBe('no base URL')
      expect(options.headers).toEqual({ Accept: 'application/json' })
    })
  })

  describe('token', () => {
    it("forwards the user's own token when no scope is configured", () => {
      const options = getEmploymentCertificateClientOptions(
        config(),
        xroadConfig,
        idsClientConfig,
      )

      expect(options.autoAuth).toBeUndefined()
    })

    it('exchanges the token when a scope is configured', () => {
      const options = getEmploymentCertificateClientOptions(
        config({ tokenExchangeScope: ['@test.is/scope'] }),
        xroadConfig,
        idsClientConfig,
      )

      expect(options.autoAuth).toEqual({
        mode: 'tokenExchange',
        issuer: 'https://identity-server.test',
        clientId: 'test-client',
        clientSecret: 'test-secret',
        scope: ['@test.is/scope'],
      })
    })

    it('refuses to work when a scope is set but the IAS client is not configured', () => {
      const options = getEmploymentCertificateClientOptions(
        config({
          directBaseUrl: 'https://api.test',
          tokenExchangeScope: ['@test.is/scope'],
        }),
        xroadConfig,
        idsClientNotConfigured,
      )

      // Never falls back to forwarding the user's own token.
      expect(options.autoAuth).toBeUndefined()
      expect(options.baseUrl).toBeUndefined()
      expect(options.notConfiguredReason).toBe(
        'a token exchange scope is set but the IAS client is not configured',
      )
    })
  })

  it('passes the timeout on', () => {
    const options = getEmploymentCertificateClientOptions(
      config({ fetchTimeout: 45000 }),
      xroadConfig,
      idsClientConfig,
    )

    expect(options.timeout).toBe(45000)
  })
})

describe('EmploymentCertificateClientConfig', () => {
  const variables = [
    'XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH',
    'FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL',
    'XROAD_FJS_EMPLOYMENT_CERTIFICATE_SCOPE',
    'XROAD_FJS_EMPLOYMENT_CERTIFICATE_TIMEOUT',
    'NODE_ENV',
  ]
  const original = Object.fromEntries(
    variables.map((name) => [name, process.env[name]]),
  )

  // The config factory reads the environment when it is called.
  const load = (env: Record<string, string>) => {
    for (const name of variables) {
      delete process.env[name]
    }
    Object.assign(process.env, { NODE_ENV: 'test' }, env)
    return EmploymentCertificateClientConfig()
  }

  afterAll(() => {
    for (const name of variables) {
      if (original[name] === undefined) {
        delete process.env[name]
      } else {
        process.env[name] = original[name]
      }
    }
  })

  it('loads with nothing set', () => {
    expect(load({})).toMatchObject({
      isConfigured: true,
      xRoadServicePath: undefined,
      directBaseUrl: undefined,
      tokenExchangeScope: [],
      fetchTimeout: 20000,
    })
  })

  it('has no base URL settings when nothing is set and NODE_ENV is production', () => {
    expect(load({ NODE_ENV: 'production' })).toMatchObject({
      isConfigured: true,
      xRoadServicePath: undefined,
      directBaseUrl: undefined,
    })
  })

  it('reads the values', () => {
    expect(
      load({
        XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH: 'IS-DEV/GOV/1/Test/test-v1',
        FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL: 'https://api.test',
        XROAD_FJS_EMPLOYMENT_CERTIFICATE_SCOPE: '@test.is/a, @test.is/b',
        XROAD_FJS_EMPLOYMENT_CERTIFICATE_TIMEOUT: '45000',
      }),
    ).toMatchObject({
      xRoadServicePath: 'IS-DEV/GOV/1/Test/test-v1',
      directBaseUrl: 'https://api.test',
      tokenExchangeScope: ['@test.is/a', '@test.is/b'],
      fetchTimeout: 45000,
    })
  })

  it('ignores the direct URL in deployed environments', () => {
    expect(
      load({
        NODE_ENV: 'production',
        FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL: 'https://api.test',
        XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH: 'IS/GOV/1/Test/test-v1',
      }),
    ).toMatchObject({
      directBaseUrl: undefined,
      xRoadServicePath: 'IS/GOV/1/Test/test-v1',
    })
  })

  it.each(['abc', '-5', '0', ''])(
    'falls back to the default timeout for %j',
    (value) => {
      expect(
        load({ XROAD_FJS_EMPLOYMENT_CERTIFICATE_TIMEOUT: value }).fetchTimeout,
      ).toBe(20000)
    },
  )
})
