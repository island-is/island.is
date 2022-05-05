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
  defaultMinReplicas: 2,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('HPA definitions', () => {
  it('Support classic replicaCount definition', () => {
    const sut = service('api')
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    expect(result.serviceDef.replicaCount).toEqual({
      min: 2,
      max: 3,
      default: 2,
    })
    expect(result.serviceDef.hpa).toEqual({
      scaling: {
        replicas: {
          min: 2,
          max: 3,
        },
        metric: { cpuAverageUtilization: '70%', nginxRequestsIrate: 2 },
      },
    })
  })
  it('Support explicit HPA definition', () => {
    const sut = service('api').replicaCount({
      min: 1,
      max: 2,
      default: 2,
      scalingMagicNumber: 5,
    })
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess

    expect(result.serviceDef.replicaCount).toEqual({
      min: 1,
      max: 2,
      default: 2,
    })
    expect(result.serviceDef.hpa).toEqual({
      scaling: {
        replicas: {
          min: 1,
          max: 2,
        },
        metric: { nginxRequestsIrate: 5, cpuAverageUtilization: '70%' },
      },
    })
  })
})
