import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, HelmService } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
import { renderHelmServiceFile } from './exports/helm'
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

describe('PodDisruptionBudget definitions', () => {
  it('Service should get a default podDisruptionBudget', async () => {
    const sut: ServiceBuilder<'api'> = service('api')
    const serviceDef: Awaited<ReturnType<typeof renderHelmServiceFile>> =
      await renderHelmServiceFile(Staging, [sut], [sut], 'no-mocks')
    expect(serviceDef.services.api.podDisruptionBudget?.minAvailable).toEqual('50%')
    expect(
      serviceDef.services.api.podDisruptionBudget?.unhealthyPodEvictionPolicy,
    ).toEqual('IfHealthyBudget')
  })
  it('Service should have minAvailable: 2, thus overriding the default', async () => {
    const sut: ServiceBuilder<'api'> = service('api').podDisruption({
      minAvailable: 2,
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    const pdb = result.serviceDef[0].podDisruptionBudget
    expect(pdb?.minAvailable).toEqual(2)
  })
  it('Service should have maxUnavailable: 2, thus overriding the default', async () => {
    const sut: ServiceBuilder<'api'> = service('api').podDisruption({
      maxUnavailable: 2,
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    const pdb = result.serviceDef[0].podDisruptionBudget
    expect(pdb?.maxUnavailable).toEqual(2)
  })
  it('Service should have unhealthyPodEvictionPolicy: IfHealthyBudget, thus overriding the default', async () => {
    const sut: ServiceBuilder<'api'> = service('api').podDisruption({
      unhealthyPodEvictionPolicy: 'IfHealthyBudget',
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    const pdb = result.serviceDef[0].podDisruptionBudget
    expect(pdb?.unhealthyPodEvictionPolicy).toEqual('IfHealthyBudget')
  })
})
