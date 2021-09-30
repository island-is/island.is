import { service } from './dsl'
import { UberChart } from './uber-chart'
import { MissingSetting } from './types/input-types'
import { serializeService } from './map-to-values'
import { SerializeErrors } from './types/output-types'
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

describe('Env variable', () => {
  const sut = service('api').env({
    A: 'B',
    B: { dev: 'C', staging: MissingSetting, prod: 'D' },
  })
  const serviceDef = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeErrors

  it('missing variables cause errors', () => {
    expect(serviceDef.errors).toEqual([
      'Missing settings for service api in env staging. Keys of missing settings: B',
    ])
  })

  it('Should not allow to collide with secrets', () => {
    const sut = service('api').env({
      A: 'B',
    }).secrets({
      A: 'somesecret'
    })
    const serviceDef = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeErrors
    
    expect(serviceDef.errors).toStrictEqual(['Error'])
  })
})
