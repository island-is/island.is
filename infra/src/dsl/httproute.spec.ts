import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { MissingSetting } from './types/input-types'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

const Prod: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'island.is',
  type: 'prod',
  featuresOn: [],
  defaultMaxReplicas: 10,
  defaultMinReplicas: 3,
  releaseName: 'web',
  awsAccountId: '222222',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('HTTPRoute definitions', () => {
  it('routes auth-required public service to gateway-auth-routing on staging', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute).toEqual({
      'primary-gw': {
        parentRefs: [
          { name: 'gateway-auth-routing', namespace: 'gateway-system' },
        ],
        hostnames: ['a.staging01.devland.is'],
        rules: [
          {
            matches: [{ pathPrefix: '/api' }],
          },
        ],
      },
    })
  })

  it('routes auth-required public service to gateway-auth-routing on dev', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Dev),
      env: Dev,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].parentRefs).toEqual([
      { name: 'gateway-auth-routing', namespace: 'gateway-system' },
    ])
  })

  it('routes public service to gateway-external on prod (no auth wall)', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Prod),
      env: Prod,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].parentRefs).toEqual([
      { name: 'gateway-external', namespace: 'gateway-system' },
    ])
  })

  it('routes auth-opt-out service to gateway-external on staging', async () => {
    const sut = service('auth-public-api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].parentRefs).toEqual([
      { name: 'gateway-external', namespace: 'gateway-system' },
    ])
  })

  it('generates httpRoute for internal (non-public) service', async () => {
    const sut = service('api').ingress({
      primary: {
        public: false,
        host: { dev: 'a', staging: '007', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute).toEqual({
      'primary-gw': {
        parentRefs: [{ name: 'gateway-internal', namespace: 'gateway-system' }],
        hostnames: ['007.internal.staging01.devland.is'],
        rules: [
          {
            matches: [{ pathPrefix: '/api' }],
          },
        ],
      },
    })
  })

  it('supports multiple httpRoutes from multiple ingresses', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
      internal: {
        public: false,
        host: { dev: 'b', staging: 'b', prod: 'b' },
        paths: ['/'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute).toEqual({
      'primary-gw': {
        parentRefs: [
          { name: 'gateway-auth-routing', namespace: 'gateway-system' },
        ],
        hostnames: ['a.staging01.devland.is'],
        rules: [{ matches: [{ pathPrefix: '/api' }] }],
      },
      'internal-gw': {
        parentRefs: [{ name: 'gateway-internal', namespace: 'gateway-system' }],
        hostnames: ['b.internal.staging01.devland.is'],
        rules: [{ matches: [{ pathPrefix: '/' }] }],
      },
    })
  })

  it('supports multiple paths as separate matches', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api', '/graphql'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].rules).toEqual([
      {
        matches: [{ pathPrefix: '/api' }, { pathPrefix: '/graphql' }],
      },
    ])
  })

  it('supports multiple hosts as hostnames', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: ['a', 'b'], staging: ['a', 'b'], prod: ['a', 'b'] },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].hostnames).toEqual([
      'a.staging01.devland.is',
      'b.staging01.devland.is',
    ])
  })

  it('skips httpRoute for MissingSetting host (same as ingress)', async () => {
    const sut = service('api').ingress({
      primary: {
        host: {
          dev: MissingSetting,
          staging: 'notmissing-staging01.devland.is',
          prod: MissingSetting,
        },
        paths: ['/api'],
      },
      internal: {
        host: {
          dev: MissingSetting,
          staging: MissingSetting,
          prod: MissingSetting,
        },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute).toEqual({
      'primary-gw': {
        parentRefs: [
          { name: 'gateway-auth-routing', namespace: 'gateway-system' },
        ],
        hostnames: ['notmissing-staging01.devland.is'],
        rules: [{ matches: [{ pathPrefix: '/api' }] }],
      },
    })
  })

  it('uses FQDN host as-is when it contains a dot', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'staging01.devland.is', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute!['primary-gw'].hostnames).toEqual([
      'staging01.devland.is',
    ])
  })

  it('coexists with ingress output', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].ingress).toBeDefined()
    expect(result.serviceDef[0].httpRoute).toBeDefined()
    expect(Object.keys(result.serviceDef[0].ingress!)).toEqual(['primary-alb'])
    expect(Object.keys(result.serviceDef[0].httpRoute!)).toEqual(['primary-gw'])
  })

  it('no httpRoute when no ingress defined', async () => {
    const sut = service('api')
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].httpRoute).toBeUndefined()
  })
})
