import { service, service2 } from './dsl'
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

const tglz = <t extends string>(): t => {
  return '' as t
}

describe('Server-side toggles', () => {
  const sut = service2('api', tglz<'api' | 'backend'>())
    .namespace('islandis')
    .image('test')
    .env({
      B: 'A',
    })
    .toggles({
      api: {
        env: {
          A: 'B',
        },
        secrets: { KEY: '/k8s/secret' },
      },
      backend: {
        env: {},
        secrets: {},
      },
    })
    .initContainer({
      containers: [{ command: 'go' }],
    })
  const result = serializeService(sut, new UberChart(Staging), [
    'api',
  ]) as SerializeSuccess

  it('env variables present when feature toggled', () => {
    expect(result.serviceDef.env!['A']).toBe('B')
  })

  it('env variables missing when feature not toggled', () => {
    const result = serializeService(
      sut,
      new UberChart({ ...Staging, type: 'prod' }),
    ) as SerializeSuccess
    expect(result.serviceDef.env!['A']).toBeUndefined()
  })

  it('secret present when feature toggled', () => {
    expect(result.serviceDef.secrets!['KEY']).toBe('/k8s/secret')
  })

  it('secret missing when feature not toggled', () => {
    const result = serializeService(
      sut,
      new UberChart({ ...Staging, type: 'prod' }),
    ) as SerializeSuccess
    expect(result.serviceDef.env!['KEY']).toBeUndefined()
  })
})
