import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'staging',
  defaultMaxReplicas: 3,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Server-side toggles', () => {
  const sut = service('api')
    .namespace('islandis')
    .image('test')
    .toggles({
      A: {
        env: {
          A: 'B',
        },
        secrets: { KEY: '/k8s/secret' },
        status: {
          dev: 'ON',
          prod: 'OFF',
          staging: 'ON',
        },
      },
    })
  const result = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeSuccess

  it('env variables', () => {
    expect(result.serviceDef.env!['A']).toBe('B')
  })

  it('image and repo', () => {
    expect(result.serviceDef.image.repository).toBe(
      '821090935708.dkr.ecr.eu-west-1.amazonaws.com/test',
    )
  })
})
