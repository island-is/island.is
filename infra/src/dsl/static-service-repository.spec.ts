import { serviceSetup as applicationSystemForm } from '../../../apps/application-system/form/infra/application-system-form'
import { serviceSetup as formSystemWeb } from '../../../apps/form-system/web/infra/form-system-web'
import { serviceSetup as portalsAdmin } from '../../../apps/portals/admin/infra/portals-admin'
import { serviceSetup as servicePortal } from '../../../apps/portals/my-pages/infra/portals-my-pages'
import { serviceSetup as islandUiStorybook } from '../../../libs/island-ui/storybook/infra/storybook'
import {
  CONTENT_SECURITY_POLICY_ENV,
  CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV,
  CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV,
} from './content-security-policy'
import { StaticServiceBuilder } from './dsl'
import { getEnvVariables } from './service-to-environment/pre-process-service'
import type { OpsEnvWithLocal } from './types/input-types'

const environments: OpsEnvWithLocal[] = ['local', 'dev', 'staging', 'prod']

const services = {
  'application-system-form': applicationSystemForm,
  'form-system-web': formSystemWeb,
  'portals-admin': portalsAdmin,
  'service-portal': servicePortal,
  'island-ui-storybook': () => islandUiStorybook({}),
}

type StaticServiceName = keyof typeof services

const resolveEnvironment = (
  serviceName: StaticServiceName,
  environment: OpsEnvWithLocal,
) => {
  const result = getEnvVariables(
    services[serviceName]().serviceDef.env,
    serviceName,
    environment,
  )
  expect(result.errors).toEqual([])
  return result.envs
}

const enforcedPolicy = (
  serviceName: StaticServiceName,
  environment: OpsEnvWithLocal,
) => {
  const value = resolveEnvironment(serviceName, environment)[
    CONTENT_SECURITY_POLICY_ENV
  ]
  expect(typeof value).toBe('string')
  return value as string
}

const directiveSources = (policy: string, directive: string) => {
  const serializedDirective = policy
    .split('; ')
    .find((candidate) => candidate.startsWith(`${directive} `))
  expect(serializedDirective).toBeDefined()
  return serializedDirective?.slice(directive.length + 1).split(' ') ?? []
}

describe('repository static service definitions', () => {
  it.each(Object.entries(services))(
    '%s uses a validated StaticServiceBuilder',
    (_name, setup) => {
      expect(setup()).toBeInstanceOf(StaticServiceBuilder)
    },
  )

  it.each(Object.keys(services) as StaticServiceName[])(
    '%s resolves enforced CSP without report-only output in every environment',
    (serviceName) => {
      for (const environment of environments) {
        const env = resolveEnvironment(serviceName, environment)
        expect(env).toHaveProperty(CONTENT_SECURITY_POLICY_ENV)
        expect(env).toHaveProperty(CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV)
        expect(env).not.toHaveProperty(CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV)
      }
    },
  )

  it.each([
    'application-system-form',
    'form-system-web',
    'portals-admin',
    'service-portal',
  ] as StaticServiceName[])(
    '%s contains the shared application policy in every environment',
    (serviceName) => {
      for (const environment of environments) {
        const policy = enforcedPolicy(serviceName, environment)

        expect(directiveSources(policy, 'default-src')).toEqual(["'self'"])
        expect(directiveSources(policy, 'base-uri')).toEqual(["'self'"])
        expect(directiveSources(policy, 'object-src')).toEqual(["'none'"])
        expect(directiveSources(policy, 'manifest-src')).toEqual(["'self'"])
        expect(directiveSources(policy, 'script-src')).toEqual([
          "'self'",
          'https://plausible.io',
        ])
        expect(directiveSources(policy, 'script-src-attr')).toEqual(["'none'"])
        expect(directiveSources(policy, 'style-src')).toEqual(
          expect.arrayContaining(["'self'", "'unsafe-inline'"]),
        )
        expect(directiveSources(policy, 'style-src-attr')).toEqual([
          "'unsafe-inline'",
        ])
        expect(directiveSources(policy, 'style-src-elem')).toEqual(
          expect.arrayContaining([
            "'self'",
            "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
            "'sha256-YFrCBlteVde6uSwx8YpZnzAcn7hUjnPIliM6Qwc6vHc='",
          ]),
        )
        expect(directiveSources(policy, 'font-src')).toEqual([
          "'self'",
          'data:',
        ])
        expect(directiveSources(policy, 'img-src')).toEqual(
          expect.arrayContaining([
            "'self'",
            'data:',
            'blob:',
            'https://images.ctfassets.net',
          ]),
        )
        expect(directiveSources(policy, 'media-src')).toEqual(
          expect.arrayContaining(["'self'", 'data:', 'blob:']),
        )
        expect(directiveSources(policy, 'worker-src')).toEqual(
          expect.arrayContaining(["'self'", 'blob:']),
        )
        expect(directiveSources(policy, 'frame-ancestors')).toEqual(["'none'"])
        expect(directiveSources(policy, 'form-action')).toEqual(["'self'"])
        expect(directiveSources(policy, 'connect-src')).toEqual(
          expect.arrayContaining([
            "'self'",
            'https://plausible.io',
            'https://s3.eu-west-1.amazonaws.com',
            'https://*.s3.eu-west-1.amazonaws.com',
          ]),
        )
      }
    },
  )

  it('scopes monitoring and the local PDF worker fallback by environment', () => {
    for (const serviceName of [
      'application-system-form',
      'form-system-web',
      'portals-admin',
      'service-portal',
    ] as StaticServiceName[]) {
      const local = enforcedPolicy(serviceName, 'local')
      expect(directiveSources(local, 'connect-src')).not.toContain(
        'https://browser-intake-datadoghq.eu',
      )
      expect(directiveSources(local, 'worker-src')).toContain(
        'https://assets.ctfassets.net',
      )

      for (const environment of ['dev', 'staging', 'prod'] as const) {
        const policy = enforcedPolicy(serviceName, environment)
        expect(directiveSources(policy, 'connect-src')).toContain(
          'https://browser-intake-datadoghq.eu',
        )
        expect(directiveSources(policy, 'worker-src')).not.toContain(
          'https://assets.ctfassets.net',
        )
      }
    }
  })

  it('configures application-system-form editor and image sources', () => {
    for (const environment of environments) {
      const policy = enforcedPolicy('application-system-form', environment)
      expect(directiveSources(policy, 'style-src')).toContain(
        'https://cdnjs.cloudflare.com',
      )
      expect(directiveSources(policy, 'img-src')).toEqual(
        expect.arrayContaining([
          'https://s3.eu-west-1.amazonaws.com',
          'https://*.s3.eu-west-1.amazonaws.com',
        ]),
      )
    }

    expect(
      directiveSources(
        enforcedPolicy('application-system-form', 'dev'),
        'img-src',
      ),
    ).toContain('https://adverts.official-journal.dev.dmr-dev.cloud')
    expect(
      directiveSources(
        enforcedPolicy('application-system-form', 'prod'),
        'img-src',
      ),
    ).toContain('https://adverts.stjornartidindi.is')

    for (const environment of ['local', 'staging', 'prod'] as const) {
      expect(
        enforcedPolicy('application-system-form', environment),
      ).not.toContain('adverts.official-journal.dev.dmr-dev.cloud')
    }
    for (const environment of ['local', 'dev', 'staging'] as const) {
      expect(
        enforcedPolicy('application-system-form', environment),
      ).not.toContain('adverts.stjornartidindi.is')
    }
  })

  it('uses only the shared policy for form-system-web', () => {
    for (const environment of environments) {
      const policy = enforcedPolicy('form-system-web', environment)
      expect(directiveSources(policy, 'frame-src')).toEqual(["'none'"])
      expect(policy).not.toContain('cdnjs.cloudflare.com')
      expect(policy).not.toContain('files.reglugerd.is')
      expect(policy).not.toContain('webapi.hugverk.is')
    }
  })

  it('scopes the portals-admin Identity Server and regulation sources', () => {
    const expectedIdentityServer = {
      local: 'https://identity-server.dev01.devland.is',
      dev: 'https://identity-server.dev01.devland.is',
      staging: 'https://identity-server.staging01.devland.is',
      prod: 'https://innskra.island.is',
    } as const

    for (const environment of environments) {
      const policy = enforcedPolicy('portals-admin', environment)
      expect(directiveSources(policy, 'connect-src')).toEqual(
        expect.arrayContaining([
          'https://files.reglugerd.is',
          expectedIdentityServer[environment],
        ]),
      )
      expect(directiveSources(policy, 'img-src')).toContain(
        'https://files.reglugerd.is',
      )
    }

    expect(enforcedPolicy('portals-admin', 'staging')).not.toContain(
      'identity-server.dev01.devland.is',
    )
    expect(enforcedPolicy('portals-admin', 'prod')).not.toContain(
      'identity-server.dev01.devland.is',
    )
    expect(enforcedPolicy('portals-admin', 'prod')).not.toContain(
      'identity-server.staging01.devland.is',
    )
  })

  it('configures service-portal trademark media and PDF printing', () => {
    for (const environment of environments) {
      const policy = enforcedPolicy('service-portal', environment)
      expect(directiveSources(policy, 'img-src')).toContain(
        'https://webapi.hugverk.is',
      )
      expect(directiveSources(policy, 'media-src')).toContain(
        'https://webapi.hugverk.is',
      )
      expect(directiveSources(policy, 'frame-src')).toEqual(['blob:'])
    }
  })

  it('uses a separate curated Storybook policy', () => {
    for (const environment of environments) {
      const policy = enforcedPolicy('island-ui-storybook', environment)
      expect(directiveSources(policy, 'script-src')).toEqual([
        "'self'",
        "'unsafe-eval'",
      ])
      expect(directiveSources(policy, 'style-src')).toEqual(
        expect.arrayContaining([
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ]),
      )
      expect(directiveSources(policy, 'font-src')).toContain(
        'https://fonts.gstatic.com',
      )
      expect(directiveSources(policy, 'img-src')).toEqual(
        expect.arrayContaining([
          'https://images.ctfassets.net',
          'https://www.stevensegallery.com',
        ]),
      )
      expect(directiveSources(policy, 'frame-src')).toEqual(
        expect.arrayContaining([
          "'self'",
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com',
          'https://player.vimeo.com',
        ]),
      )
      expect(directiveSources(policy, 'frame-ancestors')).toEqual(["'self'"])
      expect(directiveSources(policy, 'connect-src')).toContain(
        'https://fonts.googleapis.com',
      )
    }

    expect(
      directiveSources(
        enforcedPolicy('island-ui-storybook', 'local'),
        'connect-src',
      ),
    ).toContain('http://localhost:5000')
    for (const environment of ['dev', 'staging', 'prod'] as const) {
      expect(enforcedPolicy('island-ui-storybook', environment)).not.toContain(
        'localhost:5000',
      )
    }
  })

  it('does not leak local or lower-environment origins into deployed policies', () => {
    for (const serviceName of Object.keys(services) as StaticServiceName[]) {
      for (const environment of ['staging', 'prod'] as const) {
        const policy = enforcedPolicy(serviceName, environment)
        expect(policy).not.toContain('localhost')
        expect(policy).not.toContain('official-journal.dev.dmr-dev.cloud')
        expect(policy).not.toContain('identity-server.dev01.devland.is')
        if (serviceName !== 'island-ui-storybook') {
          expect(policy).not.toContain("'unsafe-eval'")
        }
        expect(policy).not.toContain('*.devland.is')
      }
      expect(enforcedPolicy(serviceName, 'prod')).not.toContain(
        'identity-server.staging01.devland.is',
      )
    }
  })

  it('selects style hashes for apps and only script hashes for Storybook', () => {
    for (const serviceName of [
      'application-system-form',
      'form-system-web',
      'portals-admin',
      'service-portal',
    ] as StaticServiceName[]) {
      expect(
        resolveEnvironment(serviceName, 'prod')[
          CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV
        ],
      ).toBe('script-src style-src-elem')
    }
    expect(
      resolveEnvironment('island-ui-storybook', 'prod')[
        CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV
      ],
    ).toBe('script-src')
  })
})
