import { JudicialAdministrationClientConfig } from './judicialAdministration.config'

describe('JudicialAdministrationClientConfig', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('should load configuration with empty fallback credentials when env vars are unset', () => {
    delete process.env.DOMSYSLA_USERNAME
    delete process.env.DOMSYSLA_PASSWORD
    delete process.env.XROAD_COURT_BANKRUPTCY_CERT_PATH

    const config = JudicialAdministrationClientConfig()

    expect(config.username).toBe('')
    expect(config.password).toBe('')
    expect(config.xRoadServicePath).toBe(
      'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
    )
  })

  it('should load configured environment variables', () => {
    process.env.DOMSYSLA_USERNAME = 'test-user'
    process.env.DOMSYSLA_PASSWORD = 'test-password'
    process.env.XROAD_COURT_BANKRUPTCY_CERT_PATH = 'custom-path'

    const config = JudicialAdministrationClientConfig()

    expect(config.username).toBe('test-user')
    expect(config.password).toBe('test-password')
    expect(config.xRoadServicePath).toBe('custom-path')
  })
})
