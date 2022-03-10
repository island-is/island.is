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

describe('Extra attributes', () => {
  it('basic values', () => {
    const sut = service('api').extraAttributes({
      staging: {
        API: 'api',
        KEY: { SUBKEY: 'value' },
      },
      dev: MissingSetting,
      prod: MissingSetting,
    })
    const serviceDef = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(serviceDef.serviceDef.extra).toEqual({
      API: 'api',
      KEY: { SUBKEY: 'value' },
    })
  })
  it('missing values', () => {
    const sut = service('api').extraAttributes({
      staging: MissingSetting,
      dev: MissingSetting,
      prod: MissingSetting,
    })
    const serviceDef = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeErrors
    expect(serviceDef.errors).toEqual([
      'Missing extra setting for service api in env staging',
    ])
  })
})
