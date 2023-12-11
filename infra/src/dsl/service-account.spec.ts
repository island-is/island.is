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

describe('Service account', () => {
  const sut = service('api').namespace('islandis').serviceAccount('demo')
  let result: SerializeSuccess<HelmService>
  beforeEach(async () => {
    result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
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
