import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { MissingSetting } from './types/input-types'
import {
  SerializeErrors,
  SerializeSuccess,
  HelmService,
} from './types/output-types'
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

describe('Extra attributes', () => {
  it('basic values', async () => {
    const sut = service('api').extraAttributes({
      staging: {
        API: 'api',
        KEY: { SUBKEY: 'value' },
      },
      dev: MissingSetting,
      prod: MissingSetting,
    })
    const serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    expect(serviceDef.serviceDef[0].extra).toEqual({
      API: 'api',
      KEY: { SUBKEY: 'value' },
    })
  })
  it('missing values', async () => {
    const sut = service('api').extraAttributes({
      staging: MissingSetting,
      dev: MissingSetting,
      prod: MissingSetting,
    })
    const serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeErrors
    expect(serviceDef.errors).toEqual([
      'Missing extra setting for service api in env staging',
    ])
  })
})
