import { service } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
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
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

const migrationInitContainer = {
  containers: [
    {
      command: 'migration',
      name: 'migration',
      args: ['all'],
      resources: {
        limits: { cpu: '100m', memory: '1024Mi' },
        requests: { cpu: '100m', memory: '1024Mi' },
      },
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
  postgres: {
    extensions: ['foo', 'bar'],
  },
}

const customImageInitContainer = {
  containers: [
    {
      command: 'run',
      name: 'init',
      image: 'container',
      args: ['some', 'command'],
      resources: {
        limits: { cpu: '100m', memory: '1024Mi' },
        requests: { cpu: '100m', memory: '1024Mi' },
      },
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
}

describe('Init-container definitions', () => {
  it('Basic setup', async () => {
    const sut = service('api').initContainer(migrationInitContainer)
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    expect(result.serviceDef[0].initContainer).toEqual({
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
            limits: {
              cpu: '100m',
              memory: '1024Mi',
            },
          },
        },
        {
          command: ['seed'],
          args: ['all'],
          name: 'seedation',
          resources: {
            limits: { cpu: '200m', memory: '256Mi' },
            requests: { cpu: '50m', memory: '128Mi' },
          },
        },
      ],
      env: {
        A: 'B',
        B: 'b',
        DB_EXTENSIONS: 'foo,bar',
        DB_USER: 'api',
        DB_NAME: 'api',
        DB_HOST: 'a',
        DB_REPLICAS_HOST: 'a',
        SERVERSIDE_FEATURES_ON: '',
      },
      secrets: { S1: '/as/dfadf', DB_PASS: '/k8s/api/DB_PASSWORD' },
    })
  })
  it('Custom image container', async () => {
    const sut = service('api').initContainer(customImageInitContainer)
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeSuccess<HelmService>
    expect(result.serviceDef[0].initContainer).toEqual({
      containers: [
        {
          command: ['run'],
          name: 'init',
          image: 'container',
          args: ['some', 'command'],
          resources: {
            limits: { cpu: '100m', memory: '1024Mi' },
            requests: { cpu: '100m', memory: '1024Mi' },
          },
        },
      ],
      env: {
        A: 'B',
        B: 'b',
        SERVERSIDE_FEATURES_ON: '',
      },
      secrets: { S1: '/as/dfadf' },
    })
  })
  it('Empty list of containers', async () => {
    const sut = service('api').initContainer({
      containers: [],
    })
    const result = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sut,
      runtime: new Kubernetes(Staging),
      env: Staging,
    })) as SerializeErrors
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
