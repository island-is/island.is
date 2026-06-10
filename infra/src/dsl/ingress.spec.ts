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

describe('HTTPRoute definitions', () => {
  it('Support multiple ingresses as HTTPRoutes', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
      },
      internal: {
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

    expect(result.serviceDef[0].ingress).toBeUndefined()
    expect(result.serviceDef[0].httpRoute).toBeDefined()
    expect(result.serviceDef[0].httpRoute!['primary-gw'].hostnames).toEqual([
      'a.staging01.devland.is',
    ])
    expect(result.serviceDef[0].httpRoute!['internal-gw'].hostnames).toEqual([
      'b.staging01.devland.is',
    ])
  })

  it('Internal ingress produces internal gateway HTTPRoute', async () => {
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

    expect(result.serviceDef[0].ingress).toBeUndefined()
    expect(
      result.serviceDef[0].httpRoute!['primary-gw'].parentRefs[0].name,
    ).toEqual('gateway-internal')
    expect(result.serviceDef[0].httpRoute!['primary-gw'].hostnames).toEqual([
      '007.internal.staging01.devland.is',
    ])
  })

  it('Public ingress produces external gateway HTTPRoute', async () => {
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

    expect(
      result.serviceDef[0].httpRoute!['primary-gw'].parentRefs[0].name,
    ).toEqual('gateway-external')
  })

  it('MissingSetting value for host skips rendering it', async () => {
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

    expect(result.serviceDef[0].httpRoute!['primary-gw'].hostnames).toEqual([
      'notmissing-staging01.devland.is',
    ])
  })

  it('No ingress output is generated', async () => {
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

    expect(result.serviceDef[0].ingress).toBeUndefined()
  })
})
