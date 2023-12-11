import { json, service } from './dsl'
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

describe('Env variable', () => {
  const sut = service('api').env({
    A: 'B',
    B: { dev: 'C', staging: MissingSetting, prod: 'D' },
  })
  let serviceDef: SerializeErrors
  beforeEach(async () => {
    serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeErrors
  })
  it('missing variables cause errors', () => {
    expect(serviceDef.errors).toEqual([
      'Missing settings for service api in env staging. Keys of missing settings: B',
    ])
  })

  it('Should not allow to collision of secrets and env variables', async () => {
    const sut = service('api')
      .env({
        A: 'B',
      })
      .secrets({
        A: 'somesecret',
      })
    const serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeErrors

    expect(serviceDef.errors).toStrictEqual([
      'Collisions in api for environment or secrets for key A',
    ])
  })

  it('Should not allow collision of secrets and env variables in init containers', async () => {
    const sut = service('api').initContainer({
      envs: {
        A: 'B',
      },
      secrets: {
        A: 'somesecret',
      },
      containers: [{ command: 'go' }],
    })
    const serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeErrors

    expect(serviceDef.errors).toStrictEqual([
      'Collisions in api for environment or secrets for key A',
    ])
  })

  it('Should not allow to collision in multiple calls', () => {
    const sut = service('api')
      .env({
        A: 'B',
      })
      .secrets({
        B: 'somesecret',
      })
    expect(() => sut.env({ A: 'C' })).toThrow(
      /Trying to set same environment variable multiple times/,
    )
    expect(() => sut.secrets({ B: 'C' })).toThrow(
      /Trying to set same environment variable multiple times/,
    )
  })

  it('Should support json encoded variables', async () => {
    const value = [{ value: 5 }]
    const sut = service('api').env({
      A: json(value),
    })
    const serviceDef = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>

    expect(serviceDef.serviceDef[0].env.A).toEqual(JSON.stringify(value))
  })
})
