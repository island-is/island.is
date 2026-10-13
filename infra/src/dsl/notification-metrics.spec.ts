import { userProfileMetricsSetup } from '../../../apps/services/user-profile/infra/service-portal-api'
import { Kubernetes } from './kubernetes-runtime'
import { EnvironmentConfig } from './types/charts'
import { SerializeSuccess, HelmService } from './types/output-types'
import { renderers } from './upstream-dependencies'
import { generateOutputOne } from './processing/rendering-pipeline'

describe('user profile metrics scheduled job', () => {
  it.each(['dev', 'staging', 'prod'] as const)(
    'renders the nightly job for %s',
    async (type) => {
      const env: EnvironmentConfig = {
        auroraHost: 'database',
        redisHost: 'redis',
        domain: 'example.is',
        type,
        featuresOn: [],
        defaultMaxReplicas: 2,
        defaultMinReplicas: 1,
        releaseName: 'web',
        awsAccountId: '111111111111',
        awsAccountRegion: 'eu-west-1',
        global: {},
      }
      const services = [userProfileMetricsSetup()]
      for (const service of services) {
        const result = (await generateOutputOne({
          outputFormat: renderers.helm,
          service,
          runtime: new Kubernetes(env),
          env,
        })) as SerializeSuccess<HelmService>
        expect(result).not.toHaveProperty('errors')
        expect(result.serviceDef[0].extra).toMatchObject({
          concurrencyPolicy: 'Forbid',
          startingDeadlineSeconds: 600,
        })
        expect(result.serviceDef[0].extra?.schedule).toMatch(
          /^(10|15|20) 3 \* \* \*$/,
        )
        if (service === services[0]) {
          expect(result.serviceDef[0].extra?.command).toEqual('node')
          expect(result.serviceDef[0].extra?.args).toEqual([
            'metrics-entrypoint.cjs',
          ])
        }
      }
    },
  )
})
