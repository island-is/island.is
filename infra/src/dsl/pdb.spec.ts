import { service, ServiceBuilder } from './dsl'
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
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('PodDisruptionBudget definitions', () => {
  it('Service should not contain podDisruptionBudget', async () => {
    const sut: ServiceBuilder<'api'> = service('api')
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    const svc = result.serviceDef[0]
    expect(svc).not.toHaveProperty('podDisruptionBudget.minAvailable')
  })
  it('Service should have minAvailable: 1', async () => {
    const sut: ServiceBuilder<'api'> = service('api').podDisruption({
      minAvailable: 1,
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    const pdb = result.serviceDef[0].podDisruptionBudget
    expect(pdb?.minAvailable).toEqual(1)
  })
})
