import { logger } from '@island.is/logging'

import { buildContentSecurityPolicy, buildDatadogCspReportUri } from './csp'

describe('buildDatadogCspReportUri', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('builds the exact Datadog EU intake URL and encodes all values', () => {
    const reportUri = buildDatadogCspReportUri({
      clientToken: 'token/+?',
      service: 'web/service',
      env: 'prod eu',
      version: '1.2.3+build',
    })

    expect(reportUri).toBe(
      'https://browser-intake-datadoghq.eu/api/v2/logs' +
        '?dd-api-key=token%2F%2B%3F' +
        '&dd-evp-origin=content-security-policy' +
        '&ddsource=csp-report' +
        '&ddtags=service%3Aweb%2Fservice%2Cenv%3Aprod+eu%2Cversion%3A1.2.3%2Bbuild',
    )
  })

  it.each(['web', 'payments', 'consultation-portal', 'auth-admin-web'])(
    'supports the canonical %s service in every environment',
    (service) => {
      for (const env of ['dev', 'staging', 'prod']) {
        const reportUri = buildDatadogCspReportUri({
          clientToken: 'test-client-token',
          service,
          env,
          version: 'git-sha',
        })

        expect(new URL(reportUri as string).searchParams.get('ddtags')).toBe(
          `service:${service},env:${env},version:git-sha`,
        )
      }
    },
  )

  it('prefers the DD_ENV injected by the deployment', () => {
    process.env.ENVIRONMENT = 'prod'
    process.env.DD_ENV = 'staging'

    const reportUri = buildDatadogCspReportUri({
      clientToken: 'test-client-token',
      service: 'web',
      version: 'git-sha',
    })

    expect(new URL(reportUri as string).searchParams.get('ddtags')).toBe(
      'service:web,env:staging,version:git-sha',
    )
  })

  it('uses ENVIRONMENT as a compatible fallback when DD_ENV is blank', () => {
    process.env.DD_ENV = '   '
    process.env.ENVIRONMENT = 'prod'

    const reportUri = buildDatadogCspReportUri({
      clientToken: 'test-client-token',
      service: 'payments',
      version: 'git-sha',
    })

    expect(new URL(reportUri as string).searchParams.get('ddtags')).toBe(
      'service:payments,env:prod,version:git-sha',
    )
  })

  it('uses DD_VERSION, then APP_VERSION, then GIT_COMMIT_SHA', () => {
    process.env.DD_VERSION = 'dd-version'
    process.env.APP_VERSION = 'app-version'
    process.env.GIT_COMMIT_SHA = 'git-sha'

    const build = () =>
      buildDatadogCspReportUri({
        clientToken: 'test-client-token',
        service: 'consultation-portal',
        env: 'dev',
      }) as string

    expect(new URL(build()).searchParams.get('ddtags')).toContain(
      'version:dd-version',
    )

    process.env.DD_VERSION = ' '
    expect(new URL(build()).searchParams.get('ddtags')).toContain(
      'version:app-version',
    )

    process.env.APP_VERSION = ''
    expect(new URL(build()).searchParams.get('ddtags')).toContain(
      'version:git-sha',
    )
  })

  it('only includes configured unified service tags', () => {
    const reportUri = buildDatadogCspReportUri({
      clientToken: 'test-client-token',
      service: 'web',
      env: '',
      version: '',
    })

    expect(new URL(reportUri as string).searchParams.get('ddtags')).toBe(
      'service:web',
    )
  })

  it('warns once and disables reporting when the client token is missing or blank', () => {
    const warn = jest.spyOn(logger, 'warn').mockImplementation()
    delete process.env.DD_CSP_REPORT_CLIENT_TOKEN

    expect(buildDatadogCspReportUri({ service: 'web' })).toBeUndefined()
    expect(
      buildDatadogCspReportUri({ clientToken: '   ', service: 'payments' }),
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      'CSP reporting is disabled because DD_CSP_REPORT_CLIENT_TOKEN is not configured.',
      { context: 'ContentSecurityPolicy' },
    )

    warn.mockRestore()
  })
})

describe('buildContentSecurityPolicy', () => {
  it('does not include report-uri by default', () => {
    const policy = buildContentSecurityPolicy('test-nonce', {
      matomoDomain: '',
    })

    expect(policy).not.toContain('report-uri')
  })

  it('includes multiple configured report-uri endpoints', () => {
    const policy = buildContentSecurityPolicy('test-nonce', {
      matomoDomain: '',
      reportUri: ['/api/csp-report', 'https://reports.example.is/csp'],
    })

    expect(policy).toContain(
      'report-uri /api/csp-report https://reports.example.is/csp',
    )
  })

  it('accepts a single report-uri endpoint', () => {
    const policy = buildContentSecurityPolicy('test-nonce', {
      matomoDomain: '',
      reportUri: '/api/csp-report',
    })

    expect(policy).toContain('report-uri /api/csp-report')
  })
})
