import { service, ServiceBuilder } from './dsl'
import { Kubernetes } from './kubernetes-runtime'
import { generateOutputOne } from './processing/rendering-pipeline'
import { EnvironmentConfig } from './types/charts'
import { Job, JobForEnv, JobItem } from './types/input-types'
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

  let devWithJobs: SerializeSuccess<HelmService>
  beforeEach(async () => {
    devWithJobs = (await generateOutputOne({
      outputFormat: renderers.helm,
      service: sutJobWithEnv,
      runtime: new Kubernetes(Dev),
      env: Dev,
    })) as SerializeSuccess<HelmService>
  })

  it('Job with envs', () => {
    expect(sutJobWithEnv.serviceDef!.jobs).toEqual(jobEnvTemplate)
  })
  it('Job without envs', () => {
    expect(sutJobWithoutEnv.serviceDef!.jobs).toEqual(jobTemplate)
  })
})
