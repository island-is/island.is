import { scheduledJob, ScheduledJob } from './dsl'
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

const Dev: EnvironmentConfig = {
  auroraHost: 'a',
  redisHost: 'b',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 1,
  releaseName: 'web',
  awsAccountId: '111111',
  awsAccountRegion: 'eu-west-1',
  global: {},
}

const Staging: EnvironmentConfig = {
  ...Dev,
  domain: 'staging01.devland.is',
  type: 'staging',
  defaultMinReplicas: 2,
}

const Prod: EnvironmentConfig = {
  ...Dev,
  domain: 'island.is',
  type: 'prod',
  defaultMinReplicas: 2,
}

const runFor = async (
  svc: ScheduledJob<string>,
  env: EnvironmentConfig,
) =>
  generateOutputOne({
    outputFormat: renderers.helm,
    service: svc as any, // ScheduledJob<S> is Omit<ScheduledJobBuilder<S>, ...>; class hierarchy lost by Omit
    runtime: new Kubernetes(env),
    env,
  })

describe('scheduledJob()', () => {
  describe('schedule', () => {
    it('emits schedule as top-level extra field (single string)', async () => {
      const sut = scheduledJob('my-job').schedule('0 3 * * *')
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({ schedule: '0 3 * * *' })
    })

    it('emits per-env schedule for dev', async () => {
      const sut = scheduledJob('my-job').schedule({
        dev: '* * * * *',
        staging: '0 * * * *',
        prod: '0 3 * * *',
      })
      const result = (await runFor(sut, Dev)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({ schedule: '* * * * *' })
    })

    it('emits per-env schedule for staging', async () => {
      const sut = scheduledJob('my-job').schedule({
        dev: '* * * * *',
        staging: '0 * * * *',
        prod: '0 3 * * *',
      })
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({ schedule: '0 * * * *' })
    })

    it('emits per-env schedule for prod', async () => {
      const sut = scheduledJob('my-job').schedule({
        dev: '* * * * *',
        staging: '0 * * * *',
        prod: '0 3 * * *',
      })
      const result = (await runFor(sut, Prod)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({ schedule: '0 3 * * *' })
    })

    it('supports Kubernetes shorthands like @hourly', async () => {
      const sut = scheduledJob('my-job').schedule('@hourly')
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({ schedule: '@hourly' })
    })

    it('returns error when per-env schedule is MissingSetting', async () => {
      const sut = scheduledJob('my-job').schedule({
        dev: MissingSetting,
        staging: MissingSetting,
        prod: '0 3 * * *',
      })
      const result = (await runFor(sut, Staging)) as SerializeErrors
      expect(result.type).toBe('error')
      expect(result.errors).toEqual([
        'Missing schedule for service my-job in env staging',
      ])
    })
  })

  describe('cron-specific fields', () => {
    it('emits concurrencyPolicy', async () => {
      const sut = scheduledJob('my-job').schedule('0 3 * * *').concurrencyPolicy('Forbid')
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({
        schedule: '0 3 * * *',
        concurrencyPolicy: 'Forbid',
      })
    })

    it('emits all CronJob fields', async () => {
      const sut = scheduledJob('my-job')
        .schedule('0 3 * * *')
        .concurrencyPolicy('Replace')
        .startingDeadlineSeconds(200)
        .successfulJobsHistoryLimit(5)
        .failedJobsHistoryLimit(2)
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({
        schedule: '0 3 * * *',
        concurrencyPolicy: 'Replace',
        startingDeadlineSeconds: 200,
        successfulJobsHistoryLimit: 5,
        failedJobsHistoryLimit: 2,
      })
    })

    it('does not emit optional fields when not set', async () => {
      const sut = scheduledJob('my-job').schedule('0 3 * * *')
      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      const extra = result.serviceDef[0].extra!
      expect(extra).not.toHaveProperty('concurrencyPolicy')
      expect(extra).not.toHaveProperty('startingDeadlineSeconds')
      expect(extra).not.toHaveProperty('successfulJobsHistoryLimit')
      expect(extra).not.toHaveProperty('failedJobsHistoryLimit')
    })
  })

  describe('inherited service methods', () => {
    it('inherits env, secrets, namespace, image, command, args', async () => {
      const sut = scheduledJob('my-job')
        .schedule('0 3 * * *')
        .image('my-image')
        .namespace('my-ns')
        .env({ FOO: 'bar' })
        .secrets({ MY_SECRET: '/k8s/secret' })
        .command('node')
        .args('main.js')

      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      const def = result.serviceDef[0]
      expect(def.namespace).toBe('my-ns')
      expect(def.image.repository).toContain('my-image')
      expect(def.env).toMatchObject({ FOO: 'bar' })
      expect(def.secrets).toMatchObject({ MY_SECRET: '/k8s/secret' })
      expect(def.command).toEqual(['node'])
      expect(def.args).toEqual(['main.js'])
    })

    it('supports .db() for database access', async () => {
      const sut = scheduledJob('my-job')
        .schedule('0 3 * * *')
        .db()

      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      const def = result.serviceDef[0]
      // '-job' postfix is stripped by ServiceBuilder.stripPostfix() when deriving DB_NAME
      expect(def.env).toMatchObject({ DB_NAME: 'my' })
    })
  })

  describe('coexistence with extraAttributes', () => {
    it('merges scheduledJob fields with existing extraAttributes', async () => {
      const sut = scheduledJob('my-job')
        .extraAttributes({
          dev: { customField: 'value' },
          staging: { customField: 'value' },
          prod: { customField: 'value' },
        })
        .schedule('0 3 * * *')

      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({
        customField: 'value',
        schedule: '0 3 * * *',
      })
    })

    it('scheduledJob fields win when extraAttributes defines the same keys', async () => {
      const sut = scheduledJob('my-job')
        .extraAttributes({
          dev: { schedule: '* * * * *', concurrencyPolicy: 'Allow' },
          staging: { schedule: '* * * * *', concurrencyPolicy: 'Allow' },
          prod: { schedule: '* * * * *', concurrencyPolicy: 'Allow' },
        })
        .schedule('0 3 * * *')
        .concurrencyPolicy('Forbid')

      const result = (await runFor(sut, Staging)) as SerializeSuccess<HelmService>
      expect(result.serviceDef[0].extra).toMatchObject({
        schedule: '0 3 * * *',
        concurrencyPolicy: 'Forbid',
      })
    })
  })
})
