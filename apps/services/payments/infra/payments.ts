import {
  CodeOwners,
  service,
  ServiceBuilder,
  json,
  ref,
} from '../../../../infra/src/dsl/dsl'
import { Base, Client, ChargeFjsV2 } from '../../../../infra/src/dsl/xroad'

const namespace = 'services-payments'
const serviceName = namespace
const imageName = namespace

export const serviceSetup = (): ServiceBuilder<'services-payments'> =>
  service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .serviceAccount(serviceName)
    .db({
      extensions: ['uuid-ossp'],
    })
    .migrations()
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/payments',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      PAYMENTS_WEB_URL: {
        dev: ref(
          (ctx) =>
            `https://${
              ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
            }beta.dev01.devland.is/greida`,
        ),
        staging: `https://beta.staging01.devland.is/greida`,
        prod: `https://island.is/greida`,
      },
      REDIS_NODES: {
        dev: json([
          'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
        ]),
        staging: json([
          'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
        ]),
        prod: json([
          'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
        ]),
      },
      PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES: '5',
      XROAD_FJS_INVOICE_PAYMENT_BASE_CALLBACK_URL: {
        dev: 'XROAD:/IS-DEV/GOV/10000/island-is-protected/payments-v1',
        staging: 'XROAD:/IS-TEST/GOV/10000/island-is-protected/payments-v1',
        prod: 'XROAD:/IS/GOV/5501692829/island-is-protected/payments-v1',
      },
      PAYMENTS_APPLE_PAY_DOMAIN: 'island.is',
      PAYMENTS_APPLE_PAY_DISPLAY_NAME: 'island.is',
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-payments/IDENTITY_SERVER_CLIENT_SECRET',
      PAYMENTS_TOKEN_SIGNING_SECRET:
        '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_SECRET',
      PAYMENTS_TOKEN_SIGNING_ALGORITHM:
        '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_ALGORITHM',
      PAYMENTS_GATEWAY_API_SECRET:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_SECRET',
      PAYMENTS_GATEWAY_API_HEADER_KEY:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_HEADER_KEY',
      PAYMENTS_GATEWAY_API_HEADER_VALUE:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_HEADER_VALUE',
      PAYMENTS_GATEWAY_API_URL:
        '/k8s/services-payments/PAYMENTS_GATEWAY_API_URL',
      PAYMENTS_GATEWAY_SYSTEM_CALLING:
        '/k8s/services-payments/PAYMENTS_GATEWAY_SYSTEM_CALLING',
      PAYMENTS_JWT_SIGNING_KEY_ID:
        '/k8s/services-payments/PAYMENTS_JWT_SIGNING_KEY_ID',
      PAYMENTS_JWT_SIGNING_PRIVATE_KEY:
        '/k8s/services-payments/PAYMENTS_JWT_SIGNING_PRIVATE_KEY',
      PAYMENTS_JWT_SIGNING_PUBLIC_KEY:
        '/k8s/services-payments/PAYMENTS_JWT_SIGNING_PUBLIC_KEY',
      PAYMENTS_PREVIOUS_KEY_ID:
        '/k8s/services-payments/PAYMENTS_PREVIOUS_KEY_ID',
      PAYMENTS_PREVIOUS_PUBLIC_KEY:
        '/k8s/services-payments/PAYMENTS_PREVIOUS_PUBLIC_KEY',
      PAYMENTS_INVOICE_TOKEN_SIGNING_SECRET:
        '/k8s/services-payments/PAYMENTS_INVOICE_TOKEN_SIGNING_SECRET',
      PAYMENTS_INVOICE_TOKEN_SIGNING_ALGORITHM:
        '/k8s/services-payments/PAYMENTS_INVOICE_TOKEN_SIGNING_ALGORITHM',
    })
    .ingress({
      primary: {
        host: {
          dev: `${serviceName}-xrd`,
          staging: `${serviceName}-xrd`,
          prod: `${serviceName}-xrd`,
        },
        paths: ['/'],
        public: false,
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          staging: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
          prod: {
            'nginx.ingress.kubernetes.io/proxy-buffering': 'on',
            'nginx.ingress.kubernetes.io/proxy-buffer-size': '8k',
          },
        },
      },
      internal: {
        host: {
          dev: serviceName,
          staging: serviceName,
          prod: serviceName,
        },
        paths: ['/'],
        public: false,
      },
    })
    .xroad(Base, Client, ChargeFjsV2)
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('application-system', 'nginx-ingress-internal', 'islandis')

export const serviceSetupForWorker =
  (): ServiceBuilder<'services-payments-worker'> =>
    service('services-payments-worker')
      .namespace(namespace)
      .image(imageName)
      .serviceAccount(serviceName)
      .codeOwner(CodeOwners.Aranja)
      .env({
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/payments',
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        PAYMENTS_WEB_URL: {
          dev: ref(
            (ctx) =>
              `https://${
                ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
              }beta.dev01.devland.is/greida`,
          ),
          staging: `https://beta.staging01.devland.is/greida`,
          prod: `https://island.is/greida`,
        },
        PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES: '5',
        PAYMENTS_APPLE_PAY_DOMAIN: 'island.is',
        PAYMENTS_APPLE_PAY_DISPLAY_NAME: 'island.is',
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/services-payments/IDENTITY_SERVER_CLIENT_SECRET',
        PAYMENTS_TOKEN_SIGNING_SECRET:
          '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_SECRET',
        PAYMENTS_TOKEN_SIGNING_ALGORITHM:
          '/k8s/services-payments/PAYMENTS_TOKEN_SIGNING_ALGORITHM',
        PAYMENTS_JWT_SIGNING_KEY_ID:
          '/k8s/services-payments/PAYMENTS_JWT_SIGNING_KEY_ID',
        PAYMENTS_JWT_SIGNING_PRIVATE_KEY:
          '/k8s/services-payments/PAYMENTS_JWT_SIGNING_PRIVATE_KEY',
        PAYMENTS_JWT_SIGNING_PUBLIC_KEY:
          '/k8s/services-payments/PAYMENTS_JWT_SIGNING_PUBLIC_KEY',
        PAYMENTS_PREVIOUS_KEY_ID:
          '/k8s/services-payments/PAYMENTS_PREVIOUS_KEY_ID',
        PAYMENTS_PREVIOUS_PUBLIC_KEY:
          '/k8s/services-payments/PAYMENTS_PREVIOUS_PUBLIC_KEY',
      })
      .xroad(Base, Client, ChargeFjsV2)
      .command('node')
      .args('main.cjs', '--job', 'worker')
      .extraAttributes({
        dev: { schedule: '*/5 * * * *' },
        staging: { schedule: '*/5 * * * *' },
        prod: { schedule: '*/5 * * * *' },
      })
