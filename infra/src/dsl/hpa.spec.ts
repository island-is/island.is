import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, ServiceHelm } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './downstream-dependencies'
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

describe('HPA definitions', () => {
  it('Support classic replicaCount definition', async () => {
    const sut = service('api')
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

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
        metric: { cpuAverageUtilization: 70, nginxRequestsIrate: 2 },
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
    const result = (await rendererForOne(
      renderers.helm,
      sut.serviceDef,
      new Kubernetes(Staging),
    )) as SerializeSuccess<ServiceHelm>

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
