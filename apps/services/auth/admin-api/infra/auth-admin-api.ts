import {
  CodeOwners,
  json,
  ref,
  service,
  ServiceBuilder,
} from '../../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistryAuthB2C,
  RskProcuring,
} from '../../../../../infra/src/dsl/xroad'

const REDIS_NODE_CONFIG = {
  dev: json([
    'clustercfg.general-redis-cluster-group.fbbkpo.euw1.cache.amazonaws.com:6379',
  ]),
  staging: json([
    'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
  ]),
  prod: json([
    'clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379',
  ]),
}

export const serviceSetup = (): ServiceBuilder<'services-auth-admin-api'> => {
  return service('services-auth-admin-api')
    .namespace('identity-server-admin')
    .image('services-auth-admin-api')
    .serviceAccount('services-auth-admin-api')
    .codeOwner(CodeOwners.Aranja)
    .db({
      name: 'servicesauth',
    })
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_ISSUER_URL_LIST: {
        dev: json([
          'https://identity-server.dev01.devland.is',
          'https://identity-server.staging01.devland.is',
          'https://innskra.island.is',
        ]),
        staging: json([
          'https://identity-server.staging01.devland.is',
          'https://innskra.island.is',
        ]),
        prod: json(['https://innskra.island.is']),
      },
      XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
      XROAD_RSK_PROCURING_ACTOR_TOKEN: 'true',
      XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Einstaklingar-v1',
        staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
        prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_REDIS_NODES: REDIS_NODE_CONFIG,
      XROAD_RSK_PROCURING_REDIS_NODES: REDIS_NODE_CONFIG,
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
      COMPANY_REGISTRY_REDIS_NODES: REDIS_NODE_CONFIG,
      SYSLUMENN_HOST: {
        dev: 'https://api.syslumenn.is/staging',
        staging: 'https://api.syslumenn.is/staging',
        prod: 'https://api.syslumenn.is/api',
      },
      SYSLUMENN_TIMEOUT: '3000',
      ZENDESK_CONTACT_FORM_SUBDOMAIN: {
        prod: 'digitaliceland',
        staging: 'digitaliceland',
        dev: 'digitaliceland',
      },
    })
    .secrets({
      NOVA_URL: '/k8s/services-auth/NOVA_URL',
      NOVA_USERNAME: '/k8s/services-auth/NOVA_USERNAME',
      NOVA_PASSWORD: '/k8s/services-auth/NOVA_PASSWORD',
      ZENDESK_CONTACT_FORM_EMAIL: '/k8s/api/ZENDESK_CONTACT_FORM_EMAIL',
      ZENDESK_CONTACT_FORM_TOKEN: '/k8s/api/ZENDESK_CONTACT_FORM_TOKEN',
      ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE:
        '/k8s/services-auth/ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE',
      ZENDESK_WEBHOOK_SECRET_IDENTITY_CONFIRMATION:
        '/k8s/services-auth/ZENDESK_WEBHOOK_SECRET_IDENTITY_CONFIRMATION',
      ZENDESK_WEBHOOK_SECRET_DELETE_GENERAL_MANDATE:
        '/k8s/services-auth/ZENDESK_WEBHOOK_SECRET_DELETE_GENERAL_MANDATE',
      CLIENT_SECRET_ENCRYPTION_KEY:
        '/k8s/services-auth/admin-api/CLIENT_SECRET_ENCRYPTION_KEY',
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-auth/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_IDS_CLIENT_SECRET:
        '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
      SYSLUMENN_USERNAME: '/k8s/services-auth/SYSLUMENN_USERNAME',
      SYSLUMENN_PASSWORD: '/k8s/services-auth/SYSLUMENN_PASSWORD',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/services-auth/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, RskProcuring, NationalRegistryAuthB2C)
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: ['/backend'],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
        },
      },
    })
    .readiness('/backend/health/check')
    .liveness('/backend/liveness')
    .resources({
      limits: {
        cpu: '400m',
        memory: '768Mi',
      },
      requests: {
        cpu: '100m',
        memory: '512Mi',
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .grantNamespaces(
      'nginx-ingress-external',
      'nginx-ingress-internal',
      'islandis',
    )
}
