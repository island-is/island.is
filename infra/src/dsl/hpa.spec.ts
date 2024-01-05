import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
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
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('HPA definitions', () => {
  it('Support classic replicaCount definition', async () => {
    const sut = service('api')
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].replicaCount).toEqual({
      min: 2,
      max: 3,
      default: 2,
    })
    expect(result.serviceDef[0].hpa).toEqual({
      scaling: {
        replicas: {
          min: 2,
          max: 3,
        },
        metric: { cpuAverageUtilization: 70, nginxRequestsIrate: 5 },
      },
    })
  })
  it('Support explicit HPA definition', async () => {
    const sut = service('api').replicaCount({
      min: 1,
      max: 2,
      default: 2,
      scalingMagicNumber: 5,
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(result.serviceDef[0].replicaCount).toEqual({
      min: 1,
      max: 2,
      default: 2,
    })
    expect(result.serviceDef[0].hpa).toEqual({
      scaling: {
        replicas: {
          min: 1,
          max: 2,
        },
        metric: { nginxRequestsIrate: 5, cpuAverageUtilization: 70 },
      },
    })
  })
})
