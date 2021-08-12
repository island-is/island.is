import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeSuccess } from './types/output-types'
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

describe('Server-side toggles', () => {
  const sut = service('api')
    .namespace('islandis')
    .image('test')
    .env({
      B: 'A',
    })
    .toggles({
      'do-not-remove-for-testing-only': {
        env: {
          A: 'B',
        },
        secrets: { KEY: '/k8s/secret' },
      },
    })
    .initContainer({
      containers: [{ command: 'go' }],
      toggles: {
        'do-not-remove-for-testing-only': {
          env: {
            C: 'D',
          },
          secrets: {
            INIT: '/a/b/c',
          },
        },
      },
    })
  const result = serializeService(
    sut,
    new UberChart({
      ...Staging,
      featuresOn: ['do-not-remove-for-testing-only'],
    }),
  ) as SerializeSuccess

  it('env variables present when feature toggled', () => {
    expect(result.serviceDef.env!['A']).toBe('B')
  })

  it('should be added to the ON list', () => {
    expect(result.serviceDef.env!['SSF_ON']).toBe(
      'do-not-remove-for-testing-only',
    )
  })

  it('should have ON list emtpy when nothing is toggled', () => {
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.env!['SSF_ON']).toBe('')
  })

  it('env variables missing when feature not toggled', () => {
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.env!['A']).toBeUndefined()
  })

  it('secret present when feature toggled', () => {
    expect(result.serviceDef.secrets!['KEY']).toBe('/k8s/secret')
  })

  it('secret missing when feature not toggled', () => {
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.env!['KEY']).toBeUndefined()
  })

  it('should have initcontainer env variables present when feature toggled', () => {
    expect(result.serviceDef.initContainer!.env!['C']).toBe('D')
  })

  it('should have initcontainer secret present when feature toggled', () => {
    expect(result.serviceDef.initContainer!.secrets!['INIT']).toBe('/a/b/c')
  })

  it('should be added to the ON list for the init container', () => {
    expect(result.serviceDef.initContainer!.env!['SSF_ON']).toBe(
      'do-not-remove-for-testing-only',
    )
  })

  it('should have ON list for the init container emtpy when nothing is toggled', () => {
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.initContainer!.env!['SSF_ON']).toBe('')
  })
})
