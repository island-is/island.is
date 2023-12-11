import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import {
  SerializeErrors,
  SerializeSuccess,
  HelmService,
} from './types/output-types'
import { EnvironmentConfig } from './types/charts'
import { MissingSetting } from './types/input-types'
import { FeatureNames } from './features'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

const Staging: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 3,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}
const Prod: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'staging01.devland.is',
  type: 'prod',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 3,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

describe('Server-side toggles', () => {
  const sut = service('api')
    .namespace('islandis')
    .image({ name: 'test' })
    .env({
      B: 'A',
    })
    .features({
      [FeatureNames.testing]: {
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
        [FeatureNames.testing]: {
          env: {
            C: 'D',
          },
          secrets: {
            INIT: '/a/b/c',
          },
        },
      },
    })
  let stagingWithFeatures: SerializeSuccess<HelmService>
  let stagingNoFeatures: SerializeSuccess<HelmService>
  beforeEach(async () => {
    const envWithFeature = {
      ...Staging,
      featuresOn: [FeatureNames.testing],
    }
    stagingWithFeatures = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(envWithFeature),
      env: envWithFeature,
    })) as SerializeSuccess<HelmService>
    stagingNoFeatures = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
  })
  it('env variables present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef[0].env!['A']).toBe('B')
  })

  it('should be added to the ON list', () => {
    expect(
      stagingWithFeatures.serviceDef[0].env!['SERVERSIDE_FEATURES_ON'],
    ).toBe('do-not-remove-for-testing-only')
  })

  it('should have ON list emtpy when nothing is toggled', () => {
    expect(stagingNoFeatures.serviceDef[0].env!['SERVERSIDE_FEATURES_ON']).toBe(
      '',
    )
  })

  it('env variables missing when feature not toggled', () => {
    expect(stagingNoFeatures.serviceDef[0].env!['A']).toBeUndefined()
  })

  it('secret present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef[0].secrets!['KEY']).toBe(
      '/k8s/secret',
    )
  })

  it('secret missing when feature not toggled', () => {
    expect(stagingNoFeatures.serviceDef[0].secrets!['KEY']).toBeUndefined()
  })

  it('should have initcontainer env variables present when feature toggled', () => {
    expect(stagingWithFeatures.serviceDef[0].initContainer!.env!['C']).toBe('D')
  })

  it('should have initcontainer secret present when feature toggled', () => {
    expect(
      stagingWithFeatures.serviceDef[0].initContainer!.secrets!['INIT'],
    ).toBe('/a/b/c')
  })

  it('should be added to the ON list for the init container', () => {
    expect(
      stagingWithFeatures.serviceDef[0].initContainer!.env![
        'SERVERSIDE_FEATURES_ON'
      ],
    ).toBe('do-not-remove-for-testing-only')
  })

  it('should have ON list for the init container emtpy when nothing is toggled', () => {
    expect(
      stagingNoFeatures.serviceDef[0].initContainer!.env![
        'SERVERSIDE_FEATURES_ON'
      ],
    ).toBe('')
  })

  describe('Missing envs variables for the target environment', () => {
    let prod: SerializeErrors
    let prodNoFeature: SerializeSuccess<HelmService>
    beforeEach(async () => {
      const prodWithFeatureOn = {
        ...Prod,
        featuresOn: [FeatureNames.testing],
      }
      prod = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(prodWithFeatureOn),
        env: prodWithFeatureOn,
      })) as SerializeErrors
      prodNoFeature = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Prod),
        env: Prod,
      })) as SerializeSuccess<HelmService>
    })
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
      .image({ name: 'test' })
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
    let prod: SerializeErrors
    let prodNoFeature: SerializeSuccess<HelmService>
    beforeEach(async () => {
      const prodWithFeatureOn = {
        ...Prod,
        featuresOn: [FeatureNames.testing],
      }
      prod = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(prodWithFeatureOn),
        env: prodWithFeatureOn,
      })) as SerializeErrors
      prodNoFeature = (await generateOutputOne({
        outputFormat: renderers.helm,
        service: sut,
        runtime: new Kubernetes(Prod),
        env: Prod,
      })) as SerializeSuccess<HelmService>
    })
    it('should result in serialization errors when feature is turned on', () => {
      expect(prod.errors).toStrictEqual([
        'Missing settings for service api in env prod. Keys of missing settings: B',
        'Collisions in api for environment or secrets for key C',
        'Collisions in api for environment or secrets for key B',
      ])
    })
    it('should not affect serialization when feature is not turned on', () => {
      expect(prodNoFeature.serviceDef).toBeDefined()
    })
  })
})
