import { EnvironmentConfig, EnvironmentConfigs } from './dsl/types/charts'
import { merge } from 'lodash'
import { FeatureNames } from './dsl/features'
const dev01: EnvironmentConfig = {
  auroraHost: 'postgres-applications.internal',
  auroraReplica:
    'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
  redisHost: JSON.stringify([
    'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
  ]),
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 1,
  awsAccountId: '013313053092',
  awsAccountRegion: 'eu-west-1',
  global: {
    global: {
      env: {
        AWS_REGION: 'eu-west-1',
        PORT: '3333',
        name: 'dev',
        NO_UPDATE_NOTIFIER: 'true',
        AUDIT_GROUP_NAME: '/island-is/audit-log',
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
  defaultMinReplicas: 1,
  redisHost: JSON.stringify([
    'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
  ]),
  awsAccountId: '261174024191',
  awsAccountRegion: 'eu-west-1',
  global: {
    global: {
      env: {
        AWS_REGION: 'eu-west-1',
        PORT: '3333',
        name: 'staging',
        NO_UPDATE_NOTIFIER: 'true',
        AUDIT_GROUP_NAME: '/island-is/audit-log',
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
    featuresOn: [FeatureNames.drivingLicense],
    defaultMaxReplicas: 10,
    defaultMinReplicas: 3,
    redisHost: JSON.stringify([
      'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
    ]),
    awsAccountId: '251502586493',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'prod',
          NO_UPDATE_NOTIFIER: 'true',
          AUDIT_GROUP_NAME: '/island-is/audit-log',
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
    auroraHost: 'postgres-ids.internal',
    domain: 'island.is',
    type: 'prod',
    featuresOn: [FeatureNames.drivingLicense],
    defaultMaxReplicas: 10,
    defaultMinReplicas: 3,
    redisHost: JSON.stringify([
      'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
    ]),
    awsAccountId: '567113216315',
    awsAccountRegion: 'eu-west-1',
    global: {
      global: {
        env: {
          AWS_REGION: 'eu-west-1',
          PORT: '3333',
          name: 'prod',
          NO_UPDATE_NOTIFIER: 'true',
          AUDIT_GROUP_NAME: '/identity-server/audit-log',
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
