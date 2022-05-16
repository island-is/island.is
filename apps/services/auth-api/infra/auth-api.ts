import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { Base, Client, RskProcuring } from '../../../../infra/src/dsl/xroad'

export const serviceSetup = (): ServiceBuilder<'services-auth-api'> => {
  return service('services-auth-api')
    .namespace('identity-server')
    .image('services-auth-api')
    .env({
      DB_REPLICAS_HOST: {
        dev:
          'dev-vidspyrna-aurora.cluster-ro-c6cxecmrvlpq.eu-west-1.rds.amazonaws.com',
        staging: 'postgres-ids.internal',
        prod: 'postgres-ids.internal',
      },
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
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
    })
    .secrets({
      DB_PASS: '/k8s/services-auth/api/DB_PASSWORD',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      RSK_USERNAME: '/k8s/xroad/client/RSK/USERNAME',
      RSK_PASSWORD: '/k8s/xroad/client/RSK/PASSWORD',
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
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
    })
    .readiness('/liveness')
    .liveness('/liveness')
    .initContainer({
      envs: {
        DB_HOST: 'postgres-ids.internal',
        DB_REPLICAS_HOST: 'postgres-ids.internal',
        DB_USER: 'servicesauth',
        DB_NAME: 'servicesauth',
      },
      containers: [
        {
          name: 'migrations',
          command: 'npx',
          args: ['sequelize-cli', 'db:migrate'],
        },
        {
          name: 'seed',
          command: 'npx',
          args: ['sequelize-cli', 'db:seed:all'],
        },
      ],
    })
}
