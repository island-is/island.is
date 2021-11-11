import { EnvironmentConfigs } from './dsl/types/charts'

export const Envs: EnvironmentConfigs = {
  dev: {
    auroraHost: 'postgres-applications.internal',
    domain: 'dev01.devland.is',
    type: 'dev',
    featuresOn: [],
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
          AUDIT_GROUP_NAME: '/island-is/audit-log',
          IDENTITY_SERVER_ISSUER_URL:
            'https://feature-identity-server-clientpolling.dev01.devland.is',
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
    auroraHost: 'postgres-applications.internal',
    domain: 'staging01.devland.is',
    type: 'staging',
    featuresOn: [],
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
          AUDIT_GROUP_NAME: '/island-is/audit-log',
          IDENTITY_SERVER_ISSUER_URL:
            'https://identity-server.staging01.devland.is',
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
    auroraHost: 'postgres-applications.internal',
    domain: 'island.is',
    type: 'prod',
    featuresOn: [],
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
          AUDIT_GROUP_NAME: '/island-is/audit-log',
          IDENTITY_SERVER_ISSUER_URL: 'https://innskra.island.is',
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
