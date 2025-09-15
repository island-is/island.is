import {
  CodeOwners,
  json,
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

export const serviceSetup = (): ServiceBuilder<'services-auth-public-api'> => {
  return service('services-auth-public-api')
    .namespace('identity-server-admin')
    .image('services-auth-public-api')
    .db({ name: 'servicesauth' })
    .codeOwner(CodeOwners.Aranja)
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/auth-api',
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
      XROAD_TJODSKRA_API_PATH: '/SKRA-Cloud-Protected/Einstaklingar-v1',
      XROAD_NATIONAL_REGISTRY_ACTOR_TOKEN: 'true',
      XROAD_RSK_PROCURING_ACTOR_TOKEN: 'true',
      XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
        dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Einstaklingar-v1',
        staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
        prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
      },
      XROAD_NATIONAL_REGISTRY_REDIS_NODES: REDIS_NODE_CONFIG,
      XROAD_RSK_PROCURING_REDIS_NODES: REDIS_NODE_CONFIG,
      XROAD_TJODSKRA_MEMBER_CODE: {
        prod: '6503760649',
        dev: '10001',
        staging: '6503760649',
      },
      PASSKEY_CORE_RP_ID: 'island.is',
      PASSKEY_CORE_RP_NAME: 'Island.is',
      PASSKEY_CORE_CHALLENGE_TTL_MS: '120000',
      REDIS_NODES: REDIS_NODE_CONFIG,
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
      COMPANY_REGISTRY_REDIS_NODES: REDIS_NODE_CONFIG,
      PASSKEY_CORE_ALLOWED_ORIGINS: json([
        // Origin for iOS app.
        'https://island.is',
        // Origin for Android test app
        'android:apk-key-hash:JgPeo_F6KYk-ngRa26tO2SsAtMiTBQCc7WtSgN-jRX0',
        // Origin for Android prod app
        'android:apk-key-hash:EsLTUu5kaY7XPmMl2f7nbq4amu-PNzdYu3FecNf90wU',
      ]),
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
    .ingress({
      primary: {
        host: {
          dev: 'identity-server.dev01.devland.is',
          staging: 'identity-server.staging01.devland.is',
          prod: 'innskra.island.is',
        },
        paths: ['/api'],
        public: true,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/rewrite-target': '/$2',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/rewrite-target': '/$2',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
            'nginx.ingress.kubernetes.io/rewrite-target': '/$2',
          },
        },
      },
    })
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
        memory: '384Mi',
      },
      requests: {
        cpu: '100m',
        memory: '256Mi',
      },
    })
}
