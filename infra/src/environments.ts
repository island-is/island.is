import { EnvironmentConfig, EnvironmentConfigs } from './dsl/types/charts'
import { merge } from 'lodash'
import { FeatureNames } from './dsl/features'
const dev01: EnvironmentConfig = {
  auroraHost: 'postgres-applications.internal',
  auroraReplica: 'postgres-applications-reader.internal',
  redisHost: JSON.stringify([
    'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
  ]),
  domain: 'dev01.devland.is',
  type: 'dev',
  featuresOn: [],
  defaultMaxReplicas: 3,
  defaultMinReplicas: 1,
  releaseName: '',
  awsAccountId: '013313053092',
  awsAccountRegion: 'eu-west-1',
  global: {
    global: {
      env: {
        AWS_REGION: 'eu-west-1',
        PORT: '3333',
        name: 'dev',
        AUDIT_GROUP_NAME: '/island-is/audit-log',
        NPM_CONFIG_UPDATE_NOTIFIER: 'false',
      },
      initContainer: {
        env: {
          AWS_REGION: 'eu-west-1',
          NPM_CONFIG_UPDATE_NOTIFIER: 'false',
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
  releaseName: '',
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
        NPM_CONFIG_UPDATE_NOTIFIER: 'false',
        AUDIT_GROUP_NAME: '/island-is/audit-log',
      },
      initContainer: {
        env: {
          AWS_REGION: 'eu-west-1',
          NPM_CONFIG_UPDATE_NOTIFIER: 'false',
        },
      },
    },
  },
}

export let Envs: EnvironmentConfigs = {
  dev01: dev01,
  devIds: merge({}, dev01, {
    awsAccountId: '324037283794',
    redisHost: JSON.stringify([
      'clustercfg.general-redis-cluster-group.fbbkpo.euw1.cache.amazonaws.com:6379',
    ]),
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
    releaseName: '',
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
          NPM_CONFIG_UPDATE_NOTIFIER: 'false',
          AUDIT_GROUP_NAME: '/island-is/audit-log',
        },
        initContainer: {
          env: {
            AWS_REGION: 'eu-west-1',
            NPM_CONFIG_UPDATE_NOTIFIER: 'false',
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
    releaseName: '',
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
          NPM_CONFIG_UPDATE_NOTIFIER: 'false',
          AUDIT_GROUP_NAME: '/identity-server/audit-log',
        },
        initContainer: {
          env: {
            AWS_REGION: 'eu-west-1',
            NPM_CONFIG_UPDATE_NOTIFIER: 'false',
          },
        },
      },
    },
  },
}
