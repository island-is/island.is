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

export const serviceSetup = (services: {
  userNotification: ServiceBuilder<'user-notification'>
}): ServiceBuilder<'services-auth-delegation-api'> => {
  return service('services-auth-delegation-api')
    .namespace('identity-server-delegation')
    .image('services-auth-delegation-api')
    .codeOwner(CodeOwners.Aranja)
    .serviceAccount('auth-delegation-api')
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
      XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
      XROAD_RSK_PROCURING_ACTOR_TOKEN: 'true',
      XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Einstaklingar-v1',
        staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
        prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_REDIS_NODES: REDIS_NODE_CONFIG,
      XROAD_RSK_PROCURING_REDIS_NODES: REDIS_NODE_CONFIG,
      USER_NOTIFICATION_API_URL: {
        dev: 'https://user-notification.internal.dev01.devland.is',
        staging: ref((h) => `http://${h.svc(services.userNotification)}`),
        prod: 'https://user-notification.internal.island.is',
      },
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
      ZENDESK_CONTACT_FORM_EMAIL: '/k8s/api/ZENDESK_CONTACT_FORM_EMAIL',
      ZENDESK_CONTACT_FORM_TOKEN: '/k8s/api/ZENDESK_CONTACT_FORM_TOKEN',
      ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE:
        '/k8s/services-auth/ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE',
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
    .readiness('/health/check')
    .liveness('/liveness')
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '512Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
    .ingress({
      internal: {
        host: {
          dev: 'auth-delegation-api.internal.identity-server.dev01.devland.is',
          staging: 'auth-delegation-api',
          prod: 'auth-delegation-api.internal.innskra.island.is',
        },
        paths: ['/'],
        public: false,
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'islandis',
      'service-portal',
      'user-notification-worker',
      'user-notification-birthday-worker',
    )
}
