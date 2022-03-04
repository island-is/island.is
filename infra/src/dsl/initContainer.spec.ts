import { service } from './dsl'
import { UberChart } from './uber-chart'
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

describe('Init-container definitions', () => {
  it('Basic setup', () => {
    const sut = service('api').initContainer({
      containers: [
        {
          command: 'migration',
          name: 'migration',
          args: ['all'],
          resources: { requests: { cpu: '100m', memory: '1024Mi' } },
        },
        {
          command: 'seed',
          name: 'seedation',
          args: ['all'],
        },
      ],
      envs: {
        A: 'B',
        B: {
          dev: 'a',
          staging: 'b',
          prod: 'c',
        },
      },
      secrets: {
        S1: '/as/dfadf',
      },
      postgres: {},
    })
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeSuccess
    expect(result.serviceDef.initContainer).toEqual({
      containers: [
        {
          command: ['migration'],
          args: ['all'],
          name: 'migration',
          resources: {
            requests: {
              cpu: '100m',
              memory: '1024Mi',
            },
          },
        },
        {
          command: ['seed'],
          args: ['all'],
          name: 'seedation',
        },
      ],
      env: {
        A: 'B',
        B: 'b',
        DB_USER: 'api',
        DB_NAME: 'api',
        DB_HOST: 'a',
        SERVERSIDE_FEATURES_ON: '',
      },
      secrets: { S1: '/as/dfadf', DB_PASS: '/k8s/api/DB_PASSWORD' },
    })
  })
  it('Empty list of containers', () => {
    const sut = service('api').initContainer({
      containers: [],
    })
    const result = serializeService(
      sut,
      new UberChart(Staging),
    ) as SerializeErrors
    expect(result.errors).toEqual([
      'No containers to run defined in initContainers',
    ])
  })
  it('Throws with multiple containers and no name', () => {
    expect(() =>
      service('api').initContainer({
        containers: [{ command: 'something' }, { command: 'other' }],
      }),
    ).toThrow('you must set a unique name for each container')
  })
  it('Throws with non-unique container names', () => {
    expect(() =>
      service('api').initContainer({
        containers: [
          { command: 'something', name: 'initcontainer' },
          { command: 'other', name: 'initcontainer' },
        ],
      }),
    ).toThrow('you must set a unique name for each container')
  })
})
