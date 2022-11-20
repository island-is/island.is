import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { SerializeSuccess, ServiceHelm } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { renderers } from './upstream-dependencies'
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

describe('Service account', () => {
  const sut = service('api').namespace('islandis').serviceAccount('demo')
  let result: SerializeSuccess<ServiceHelm>
  beforeEach(async () => {
    result = (await rendererForOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<ServiceHelm>
  })
  it('service account name', () => {
    expect(result.serviceDef[0].serviceAccount).toEqual({
      annotations: {
        'eks.amazonaws.com/role-arn': 'arn:aws:iam::111111:role/demo',
      },
      create: true,
      name: 'demo',
    })
  })
})
