import { service } from './dsl'
import { UberChart } from './uber-chart'
import { serializeService } from './map-to-values'
import { SerializeErrors, SerializeSuccess } from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { MissingSetting } from './types/input-types'

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
const Prod: EnvironmentConfig = {
  auroraHost: 'a',
  domain: 'staging01.devland.is',
  type: 'prod',
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
    .features({
      'do-not-remove-for-testing-only': {
        env: {
          A: {
            dev: 'B1',
            staging: 'B',
            prod: MissingSetting,
          },
        },
        secrets: { KEY: '/k8s/secret' },
      },
    })
    .initContainer({
      containers: [{ command: 'go' }],
      features: {
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
  const stagingWithFeatures = serializeService(
    sut,
    new UberChart({
      ...Staging,
      featuresOn: ['do-not-remove-for-testing-only'],
    }),
  ) as SerializeSuccess
  const stagingNoFeatures = serializeService(
    sut,
    new UberChart(Staging),
  ) as SerializeSuccess

  it('env variables present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef.env!['A']).toBe('B')
  })

  it('should be added to the ON list', () => {
    expect(stagingWithFeatures.serviceDef.env!['SERVERSIDE_FEATURES_ON']).toBe(
      'do-not-remove-for-testing-only',
    )
  })

  it('should have ON list emtpy when nothing is toggled', () => {
    expect(stagingNoFeatures.serviceDef.env!['SERVERSIDE_FEATURES_ON']).toBe('')
  })

  it('env variables missing when feature not toggled', () => {
    expect(stagingNoFeatures.serviceDef.env!['A']).toBeUndefined()
  })

  it('secret present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef.secrets!['KEY']).toBe('/k8s/secret')
  })

  it('secret missing when feature not toggled', () => {
    expect(stagingNoFeatures.serviceDef.secrets!['KEY']).toBeUndefined()
  })

  it('should have initcontainer env variables present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef.initContainer!.env!['C']).toBe('D')
  })

  it('should have initcontainer secret present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef.initContainer!.secrets!['INIT']).toBe(
      '/a/b/c',
    )
  })

  it('should be added to the ON list for the init container', () => {
    expect(
      stagingWithFeatures.serviceDef.initContainer!.env![
        'SERVERSIDE_FEATURES_ON'
      ],
    ).toBe('do-not-remove-for-testing-only')
  })

  it('should have ON list for the init container emtpy when nothing is toggled', () => {
    expect(
      stagingNoFeatures.serviceDef.initContainer!.env![
        'SERVERSIDE_FEATURES_ON'
      ],
    ).toBe('')
  })

  describe('Missing envs variables for the target environment', () => {
    const prod = serializeService(
      sut,
      new UberChart({
        ...Prod,
        featuresOn: ['do-not-remove-for-testing-only'],
      }),
    ) as SerializeErrors
    const prodNoFeature = serializeService(
      sut,
      new UberChart(Prod),
    ) as SerializeSuccess

    it('should result in serialization errors when feature is turned on', () => {
      expect(prod.errors).toStrictEqual([
        'Missing settings for service api in env prod. Keys of missing settings: A',
      ])
    })
    it('should not affect serialization when feature is not turned on', () => {
      expect(prodNoFeature.serviceDef).toBeDefined()
    })
  })
  describe('Collision of feature config with main one', () => {
    const sut = service('api')
      .namespace('islandis')
      .image('test')
      .env({
        B: 'A',
      })
      .features({
        'do-not-remove-for-testing-only': {
          env: {
            B: {
              dev: 'B1',
              staging: 'B',
              prod: MissingSetting,
            },
          },
          secrets: { B: '/k8s/secret' },
        },
      })
      .initContainer({
        containers: [{ command: 'go' }],
        features: {
          'do-not-remove-for-testing-only': {
            env: {
              C: 'D',
            },
            secrets: {
              C: '/a/b/c',
            },
          },
        },
      })
    const prod = serializeService(
      sut,
      new UberChart({
        ...Prod,
        featuresOn: ['do-not-remove-for-testing-only'],
      }),
    ) as SerializeErrors
    const prodNoFeature = serializeService(
      sut,
      new UberChart(Prod),
    ) as SerializeSuccess

    it('should result in serialization errors when feature is turned on', () => {
      expect(prod.errors).toStrictEqual([
        'Missing settings for service api in env prod. Keys of missing settings: B',
        'Collisions for environment or secrets for key C',
        'Collisions for environment or secrets for key B',
      ])
    })
    it('should not affect serialization when feature is not turned on', () => {
      expect(prodNoFeature.serviceDef).toBeDefined()
    })
  })
})
