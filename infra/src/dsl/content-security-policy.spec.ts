import {
  CONTENT_SECURITY_POLICY_ENV,
  CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV,
  CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV,
  serializeContentSecurityPolicy,
} from './content-security-policy'
import {
  ScheduledJobBuilder,
  StaticServiceBuilder,
  scheduledJob,
  service,
  staticService,
} from './dsl'
import { getEnvVariables } from './service-to-environment/pre-process-service'

const staticProject = 'application-system-form'

describe('staticService()', () => {
  it('returns a static builder for a docker-static Nx project', () => {
    expect(staticService(staticProject)).toBeInstanceOf(StaticServiceBuilder)
    expect(new StaticServiceBuilder(staticProject)).toBeInstanceOf(
      StaticServiceBuilder,
    )
  })

  it('keeps csp() available through inherited builder methods', () => {
    const sut = staticService(staticProject)
      .namespace('application-system')
      .liveness('/liveness')
      .env({ BASEPATH: '/umsoknir' })
      .csp({ enforce: { defaultSrc: ["'self'"] } })

    expect(sut).toBeInstanceOf(StaticServiceBuilder)
    expect(sut.serviceDef.env[CONTENT_SECURITY_POLICY_ENV]).toBe(
      "default-src 'self'",
    )
  })

  it('does not expose csp() on regular services or scheduled jobs', () => {
    expect('csp' in service('api')).toBe(false)
    expect('csp' in scheduledJob('my-job')).toBe(false)

    if (false) {
      // @ts-expect-error CSP is only supported by StaticServiceBuilder.
      service('api').csp({})
      // @ts-expect-error CSP is not supported by ScheduledJobBuilder.
      scheduledJob('my-job').csp({})
      // Ensure the concrete class does not gain the inherited method either.
      // @ts-expect-error CSP is not supported by ScheduledJobBuilder.
      new ScheduledJobBuilder('my-job').csp({})
    }
  })

  it('serializes enforcement and report-only policies independently', () => {
    const enforce = staticService(staticProject).csp({
      enforce: { defaultSrc: ["'self'"] },
    })
    const reportOnly = staticService(staticProject).csp({
      reportOnly: { objectSrc: ["'none'"] },
    })
    const both = staticService(staticProject).csp({
      enforce: { defaultSrc: ["'self'"] },
      reportOnly: { objectSrc: ["'none'"] },
    })

    expect(enforce.serviceDef.env).toMatchObject({
      [CONTENT_SECURITY_POLICY_ENV]: "default-src 'self'",
    })
    expect(enforce.serviceDef.env).not.toHaveProperty(
      CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV,
    )
    expect(reportOnly.serviceDef.env).toMatchObject({
      [CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV]: "object-src 'none'",
    })
    expect(reportOnly.serviceDef.env).not.toHaveProperty(
      CONTENT_SECURITY_POLICY_ENV,
    )
    expect(both.serviceDef.env).toMatchObject({
      [CONTENT_SECURITY_POLICY_ENV]: "default-src 'self'",
      [CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV]: "object-src 'none'",
    })
  })

  it('supports shared and per-environment policies with optional local', () => {
    const sut = staticService(staticProject).csp({
      enforce: {
        dev: { defaultSrc: ["'self'", 'https://dev.example.is'] },
        staging: { defaultSrc: ["'self'", 'https://staging.example.is'] },
        prod: { defaultSrc: ["'self'"] },
        local: { defaultSrc: ["'self'", 'http://localhost:4200'] },
      },
    })

    expect(sut.serviceDef.env[CONTENT_SECURITY_POLICY_ENV]).toEqual({
      dev: "default-src 'self' https://dev.example.is",
      staging: "default-src 'self' https://staging.example.is",
      prod: "default-src 'self'",
      local: "default-src 'self' http://localhost:4200",
    })
  })

  it('serializes validated artifact hash directive selection', () => {
    const sut = staticService(staticProject).csp({
      enforce: {
        scriptSrc: ["'self'"],
        styleSrcElem: ["'self'"],
      },
      hashDirectives: ['style-src-elem', 'script-src'],
    })

    expect(
      sut.serviceDef.env[CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV],
    ).toBe('script-src style-src-elem')
    expect(() =>
      staticService(staticProject).csp({
        enforce: { scriptSrc: ["'self'"] },
        hashDirectives: [],
      }),
    ).toThrow(/non-empty array/)
    expect(() =>
      staticService(staticProject).csp({
        hashDirectives: ['script-src'],
      }),
    ).toThrow(/require an enforcement policy/)
  })

  it('relies on the environment pipeline to fall local back to dev', () => {
    const sut = staticService(staticProject).csp({
      enforce: {
        dev: { defaultSrc: ["'self'", 'http://localhost:4200'] },
        staging: { defaultSrc: ["'self'"] },
        prod: { defaultSrc: ["'self'"] },
      },
    })

    expect(
      getEnvVariables(sut.serviceDef.env, staticProject, 'local').envs[
        CONTENT_SECURITY_POLICY_ENV
      ],
    ).toBe("default-src 'self' http://localhost:4200")
  })

  it('does not add environment values for omitted or empty policies', () => {
    expect(staticService(staticProject).csp({}).serviceDef.env).toEqual({})
    expect(
      staticService(staticProject).csp({ enforce: {} }).serviceDef.env,
    ).toEqual({})
    expect(
      staticService(staticProject).csp({
        reportOnly: { dev: {}, staging: {}, prod: {} },
      }).serviceDef.env,
    ).toEqual({})
  })

  it('rejects reserved environment variable collisions', () => {
    expect(() =>
      staticService(staticProject)
        .env({ [CONTENT_SECURITY_POLICY_ENV]: 'manually configured' })
        .csp({ enforce: { defaultSrc: ["'self'"] } }),
    ).toThrow(/same environment variable multiple times/)

    expect(() =>
      staticService(staticProject)
        .csp({ reportOnly: { defaultSrc: ["'self'"] } })
        .env({ [CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV]: 'manual' }),
    ).toThrow(/same environment variable multiple times/)

    expect(() =>
      staticService(staticProject)
        .csp({
          enforce: { scriptSrc: ["'self'"] },
          hashDirectives: ['script-src'],
        })
        .env({ [CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV]: 'manual' }),
    ).toThrow(/same environment variable multiple times/)
  })
})

describe('CSP serialization', () => {
  it('uses kebab-case, deterministic directive order, and source order', () => {
    expect(
      serializeContentSecurityPolicy({
        upgradeInsecureRequests: true,
        scriptSrc: ["'self'", 'https://plausible.io'],
        objectSrc: ["'none'"],
        defaultSrc: ["'self'"],
      }),
    ).toBe(
      "default-src 'self'; object-src 'none'; script-src 'self' https://plausible.io; upgrade-insecure-requests",
    )
  })

  it('supports sandbox, reporting, mixed-content, and Trusted Types directives', () => {
    expect(
      serializeContentSecurityPolicy({
        sandbox: ['allow-forms', 'allow-scripts'],
        reportTo: ['csp-endpoint'],
        blockAllMixedContent: true,
        requireTrustedTypesFor: ["'script'"],
        trustedTypes: ['app-policy', "'allow-duplicates'"],
      }),
    ).toBe(
      "block-all-mixed-content; report-to csp-endpoint; require-trusted-types-for 'script'; sandbox allow-forms allow-scripts; trusted-types app-policy 'allow-duplicates'",
    )
  })

  it('rejects unknown directives and invalid values at runtime', () => {
    expect(() =>
      serializeContentSecurityPolicy({ unknownDirective: ["'self'"] } as any),
    ).toThrow(/Unknown CSP directive/)
    expect(() =>
      serializeContentSecurityPolicy({
        defaultSrc: ['https://safe.is; injected'],
      }),
    ).toThrow(/unsafe value/)
    expect(() =>
      serializeContentSecurityPolicy({
        defaultSrc: ['https://safe.is\ninvalid'],
      }),
    ).toThrow(/unsafe value/)
    expect(() =>
      serializeContentSecurityPolicy({ defaultSrc: ["'not-a-keyword'"] }),
    ).toThrow(/invalid value/)
    expect(() => serializeContentSecurityPolicy({ defaultSrc: [] })).toThrow(
      /must not be empty/,
    )
  })
})
