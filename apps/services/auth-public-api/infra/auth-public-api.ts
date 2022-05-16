import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, RskProcuring } from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'services-auth-public-api'> => {
  return service('services-auth-public-api')
    .namespace('identity-server-admin')
    .image('services-auth-public-api')
    .env({
      DB_HOST: 'postgres-ids.internal',
      DB_USER: 'servicesauth',
      DB_NAME: 'servicesauth',
      DB_REPLICAS_HOST: 'postgres-ids.internal',
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
      XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
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
        dev:
          '["clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379"]',
        staging:
          '["clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379"]',
        prod:
          '["clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379"]',
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
    })
    .secrets({
      DB_PASS: '/k8s/services-auth/api/DB_PASSWORD',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      RSK_USERNAME: '/k8s/xroad/client/RSK/USERNAME',
      RSK_PASSWORD: '/k8s/xroad/client/RSK/PASSWORD',
      NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
        '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
    })
    .xroad(Base, Client, RskProcuring)
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: [
          {
            path: '/api(/|$)(.*)',
            pathType: 'Prefix',
          },
        ],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
}
