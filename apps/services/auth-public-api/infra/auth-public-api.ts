import { ref, service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'auth-public-api'> => {
  return service('auth-public-api')
    .namespace('identity-server')
    .env({
      IDS_ISSUER: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      PUBLIC_URL: {
        dev: 'https://identity-server.dev01.devland.is/api',
        staging: 'https://identity-server.staging01.devland.is/api',
        prod: 'https://innskra.island.is/api',
      },
      XROAD_BASE_PATH: {
        dev: 'http://securityserver.dev01.devland.is',
        staging: 'http://securityserver.staging01.devland.is',
        prod: 'http://securityserver.island.is',
      },
      XROAD_BASE_PATH_WITH_ENV: {
        dev: 'http://securityserver.dev01.devland.is/r1/IS-DEV',
        staging: 'http://securityserver.staging01.devland.is/r1/IS-TEST',
        prod: 'http://securityserver.island.is/r1/IS',
      },
      XROAD_CLIENT_ID: {
        dev: 'IS-DEV/GOV/10000/island-is-client',
        staging: 'IS-TEST/GOV/5501692829/island-is-client',
        prod: 'IS/GOV/5501692829/island-is-client',
      },
      XROAD_RSK_MEMBER_CODE: {
        dev: '10006',
        staging: '5402696029',
        prod: '5402696029',
      },
      XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
        staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
        prod: 'IS/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_REDIS_NODES: {
        dev: '["clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379"]',
        staging: '["clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379"]',
        prod: '["clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379"]',
      },
      XROAD_NATIONAL_REGISTRY_API_PATH: {
        dev: '/SKRA-Protected/Einstaklingar-v1',
        staging: '/SKRA-Protected/Einstaklingar-v1',
        prod: '/SKRA-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_CLIENT_ID: {
        dev: 'IS-DEV/GOV/10000/island-is-client',
        staging: 'IS-TEST/GOV/5501692829/island-is-client',
        prod: 'IS/GOV/5501692829/island-is-client',
      },
      XROAD_NATIONAL_REGISTRY_MEMBER_CODE: {
        dev: '10001',
        staging: '6503760649',
        prod: '6503760649',
      },
      XROAD_RSK_PROCURING_PATH: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/prokura-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/prokura-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/prokura-v1',
      },
      XROAD_RSK_PROCURING_REDIS_NODES: {
        dev: '["clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379"]',
        staging: '["clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379"]',
        prod: '["clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379"]',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: ['/api(/|$)(.*)'],
        pathType: 'Prefix',
        public: true,
      },
    })
    .secrets({
        CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY'
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
