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

describe('Ingress definitions', () => {
  it('Support multiple ingresses', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
        pathTypeOverride: 'ImplementationSpecific',
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

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [
          {
            host: 'a.staging01.devland.is',
            paths: ['/api'],
            pathTypeOverride: 'ImplementationSpecific',
          },
        ],
      },
      'internal-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [{ host: 'b.staging01.devland.is', paths: ['/'] }],
      },
    })
  })

  it('Extra annotations', async () => {
    const sut = service('api').ingress({
      primary: {
        host: { dev: 'a', staging: 'staging01.devland.is', prod: 'a' },
        paths: ['/api'],
        extraAnnotations: {
          dev: {},
          staging: { A: 'B' },
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

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
          A: 'B',
        },
        hosts: [{ host: 'staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
  it('MissingSetting value for ingress host skips rendering it', async () => {
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

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [{ host: 'notmissing-staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
  it('Internal ingress basic', async () => {
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

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-internal-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [{ host: '007.internal.staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
  it('No annotations is permitted', async () => {
    const sut = service('api').ingress({
      primary: {
        public: false,
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
        extraAnnotations: {
          staging: {
            'nginx.ingress.kubernetes.io/foo': 'true',
          },
        },
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-internal-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
          'nginx.ingress.kubernetes.io/foo': 'true',
        },
        hosts: [
          {
            host: 'a.internal.staging01.devland.is',
            paths: ['/api'],
          },
        ],
      },
    })
  })
  it('Empty annotations are valid', async () => {
    const sut = service('api').ingress({
      primary: {
        public: false,
        host: { dev: 'a', staging: 'a', prod: 'a' },
        paths: ['/api'],
        extraAnnotations: {
          staging: {},
        },
      },
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-internal-alb',
          'nginx.ingress.kubernetes.io/service-upstream': 'true',
        },
        hosts: [
          {
            host: 'a.internal.staging01.devland.is',
            paths: ['/api'],
          },
        ],
      },
    })
  })
})
