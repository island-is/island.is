import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { generateOutputOne } from './processing/rendering-pipeline'
import { EnvironmentConfig } from './types/charts'
import { Job } from './types/input-types'
import { HelmService, SerializeSuccess } from './types/output-types'
import { renderers } from './upstream-dependencies'

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 1,
  defaultMinReplicas: 1,
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

const extraAttributes = {
  annotations: {
    someAnnotation: 'annotation',
  },
}

const jobTemplate: Job = [
  {
    name: 'job1',
    containers: [
      {
        command: 'node',
      },
    ],
  },
  {
    name: 'job2',
    containers: [
      {
        command: 'node',
      },
    ],
  },
]

const jobEnvTemplate: Job = {
  dev: jobTemplate,
  staging: [],
  prod: [],
}

describe('Job helm values', () => {
  const sutJobWithEnv: ServiceBuilder<'api'> = service('api').jobs({
    ...jobEnvTemplate,
  })
  const sutJobWithoutEnv: ServiceBuilder<'api'> =
    service('api').jobs(jobTemplate)

  const sutJobWithExtraAttributes: ServiceBuilder<'api'> = service('api').jobs({
    ...jobTemplate.map((job) => {
      return {
        ...job,
        extraAttributes: { dev: extraAttributes, staging: {}, prod: {} },
      }
    }),
  })

  let resultOne: SerializeSuccess<HelmService>
  beforeEach(async () => {
    resultOne = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sutJobWithEnv,
      runtime: new Kubernetes(Dev),
      env: Dev,
    })) as SerializeSuccess<HelmService>
  })

  let resultTwo: SerializeSuccess<HelmService>
  beforeEach(async () => {
    resultTwo = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sutJobWithoutEnv,
      runtime: new Kubernetes(Dev),
      env: Dev,
    })) as SerializeSuccess<HelmService>
  })

  it('Job values without envs', () => {
    expect(resultOne.serviceDef[0].jobs).toEqual(jobTemplate)
    expect(resultTwo.serviceDef[0].jobs).toEqual(jobTemplate)
  })
})
