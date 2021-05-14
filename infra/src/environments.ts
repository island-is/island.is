import { EnvironmentConfigs } from './dsl/types/charts'

export const Envs: EnvironmentConfigs = {
  dev: {
    auroraHost:
      'dev-vidspyrna-aurora-1.c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
    domain: 'dev01.devland.is',
    type: 'dev',
    defaultMaxReplicas: 3,
    rolloutStrategy: 'Recreate',
    releaseName: 'web',
    awsAccountId: '013313053092',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'dev',
        },
        image: {
          tag: 'latest_master',
        },
        initContainer: {
          env: {
            AWS_REGION: 'eu-west-1',
          },
        },
      },
    },
  },
  staging: {
    auroraHost:
      'staging-vidspyrna-aurora-2.cxg4o2lgih4t.eu-west-1.rds.amazonaws.com',
    domain: 'staging01.devland.is',
    type: 'staging',
    defaultMaxReplicas: 3,
    releaseName: 'web',
    awsAccountId: '261174024191',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'staging',
        },
        image: {
          tag: 'latest_master',
        },
        initContainer: {
          env: {
            AWS_REGION: 'eu-west-1',
          },
        },
      },
    },
  },
  prod: {
    auroraHost:
      'prod-vidspyrna-aurora.cluster-cneim47t7wpr.eu-west-1.rds.amazonaws.com',
    domain: 'island.is',
    type: 'prod',
    defaultMaxReplicas: 10,
    releaseName: 'web',
    awsAccountId: '251502586493',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'prod',
        },
        image: {
          tag: 'latest_master',
        },
        initContainer: {
          env: {
            AWS_REGION: 'eu-west-1',
          },
        },
      },
    },
  },
}
