import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { MissingSetting } from './types/input-types'
import { SerializeSuccess, ServiceHelm } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './service-dependencies'
import { rendererForOne } from './processing/service-sets'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
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
      },
      secondary: {
        host: { dev: 'b', staging: 'b', prod: 'b' },
        paths: ['/'],
      },
    })
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
        },
        hosts: [{ host: 'a.staging01.devland.is', paths: ['/api'] }],
      },
      'secondary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
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
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
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
      secondary: {
        host: {
          dev: MissingSetting,
          staging: MissingSetting,
          prod: MissingSetting,
        },
        paths: ['/api'],
      },
    })
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
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
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

    expect(result.serviceDef[0].ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-internal-alb',
        },
        hosts: [{ host: '007.internal.staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
})
