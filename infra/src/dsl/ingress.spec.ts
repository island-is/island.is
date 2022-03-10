import { service } from './dsl'
import { UberChart } from './uber-chart'
import { MissingSetting } from './types/input-types'
import { serializeService } from './map-to-values'
import { SerializeErrors, SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Ingress definitions', () => {
  it('Support mutltiple ingresses', () => {
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
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    expect(result.serviceDef.ingress).toEqual({
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

  it('Extra annotations', () => {
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
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    expect(result.serviceDef.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-external-alb',
          A: 'B',
        },
        hosts: [{ host: 'staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
  it('Ingress missing generates errors', () => {
    const sut = service('api').ingress({
      primary: {
        host: {
          dev: MissingSetting,
          staging: MissingSetting,
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
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeErrors

    expect(result.errors).toEqual([
      'Missing ingress host info for service:api, ingress:primary in env:staging',
      'Missing ingress host info for service:api, ingress:secondary in env:staging',
    ])
  })
  it('Internal ingress basic', () => {
    const sut = service('api').ingress({
      primary: {
        public: false,
        host: { dev: 'a', staging: '007', prod: 'a' },
        paths: ['/api'],
      },
    })
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    expect(result.serviceDef.ingress).toEqual({
      'primary-alb': {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx-internal-alb',
        },
        hosts: [{ host: '007.internal.staging01.devland.is', paths: ['/api'] }],
      },
    })
  })
})
