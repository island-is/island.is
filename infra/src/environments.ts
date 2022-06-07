import { EnvironmentConfig, EnvironmentConfigs } from './dsl/types/charts'
import { merge } from 'lodash'

const dev01: EnvironmentConfig = {
  auroraHost: 'postgres-applications.internal',
  auroraReplica:
    'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: ['judicial-system-sqs'],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
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
}
const staging01: EnvironmentConfig = {
  auroraHost: 'postgres-applications.internal',
  domain: 'staging01.devland.is',
  type: 'staging',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 2,
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
}

export let Envs: EnvironmentConfigs = {
  dev01: dev01,
  devIds: merge({}, dev01, {
    global: {
      global: { env: { AUDIT_GROUP_NAME: '/identity-server/audit-log' } },
    },
  }),
  stagingIds: merge({}, staging01, {
    global: {
      global: { env: { AUDIT_GROUP_NAME: '/identity-server/audit-log' } },
    },
  }),
  staging01: staging01,
  prod: {
    auroraHost: 'postgres-applications.internal',
    domain: 'island.is',
    type: 'prod',
    featuresOn: ['driving-license-use-v1-endpoint-for-v2-comms'],
    defaultMaxReplicas: 10,
    defaultMinReplicas: 3,
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
  'prod-ids': {
    auroraHost: 'postgres-applications.internal',
    domain: 'island.is',
    type: 'prod',
    featuresOn: ['driving-license-use-v1-endpoint-for-v2-comms'],
    defaultMaxReplicas: 10,
    defaultMinReplicas: 3,
    releaseName: 'web',
    awsAccountId: '567113216315',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'prod',
          AUDIT_GROUP_NAME: '/identity-server/audit-log',
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
