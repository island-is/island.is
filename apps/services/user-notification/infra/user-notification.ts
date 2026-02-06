import {
  CodeOwners,
  ServiceBuilder,
  json,
  ref,
  service,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistryB2C,
  RskCompanyInfo,
} from '../../../../infra/src/dsl/xroad'
import type { Context } from '../../../../infra/src/dsl/types/input-types'

const serviceName = 'user-notification'
const serviceWorkerName = `${serviceName}-worker`
const serviceCleanupWorkerName = `${serviceName}-cleanup-worker`
const serviceBirthdayWorkerName = `${serviceName}-birthday-worker`
const imageName = `services-${serviceName}`
const MAIN_QUEUE_NAME = serviceName
const DEAD_LETTER_QUEUE_NAME = `${serviceName}-failure`

const getEnv = (services: {
  userProfileApi: ServiceBuilder<'service-portal-api'>
}) => ({
  MAIN_QUEUE_NAME: ref((ctx) =>
    ctx.featureDeploymentName
      ? `${MAIN_QUEUE_NAME}-${ctx.featureDeploymentName}`
      : MAIN_QUEUE_NAME,
  ),
  DEAD_LETTER_QUEUE_NAME: ref((ctx) =>
    ctx.featureDeploymentName
      ? `${DEAD_LETTER_QUEUE_NAME}-${ctx.featureDeploymentName}`
      : DEAD_LETTER_QUEUE_NAME,
  ),
  IDENTITY_SERVER_ISSUER_URL: {
    dev: 'https://identity-server.dev01.devland.is',
    staging: 'https://identity-server.staging01.devland.is',
    prod: 'https://innskra.island.is',
  },
  USER_PROFILE_CLIENT_URL: ref(
    (ctx) => `http://${ctx.svc(services.userProfileApi)}`,
  ),
  AUTH_DELEGATION_API_URL: {
    dev: 'https://auth-delegation-api.internal.identity-server.dev01.devland.is',
    staging:
      'http://services-auth-delegation-api.identity-server-delegation.svc.cluster.local',
    prod: 'https://auth-delegation-api.internal.innskra.island.is',
  },
  AUTH_DELEGATION_MACHINE_CLIENT_SCOPE: json([
    '@island.is/auth/delegations/index:system',
  ]),
  SERVICE_PORTAL_CLICK_ACTION_URL: 'https://island.is/minarsidur',
  SERVICE_PORTAL_BFF_LOGIN_URL: {
    dev: 'https://beta.dev01.devland.is/bff/login',
    staging: 'https://beta.staging01.devland.is/bff/login',
    prod: 'https://island.is/bff/login',
  },
  EMAIL_FROM_ADDRESS: {
    dev: 'development@island.is',
    staging: 'development@island.is',
    prod: 'noreply@island.is',
  },
  REDIS_USE_SSL: 'true',
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
})

export const userNotificationServiceSetup = (services: {
  userProfileApi: ServiceBuilder<'service-portal-api'>
}): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceName)
    .codeOwner(CodeOwners.Juni)
    .db()
    .command('node')
    .args('--no-experimental-fetch', 'main.cjs')
    .redis()
    .env(getEnv(services))
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
      IDENTITY_SERVER_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistryB2C, RskCompanyInfo)
    .liveness('/liveness')
    .readiness('/health/check')
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
    .resources({
      limits: {
        cpu: '400m',
        memory: '384Mi',
      },
      requests: {
        cpu: '150m',
        memory: '256Mi',
      },
    })
    .grantNamespaces(
      'nginx-ingress-internal',
      'islandis',
      'identity-server-delegation',
      'application-system',
    )

export const userNotificationWorkerSetup = (services: {
  userProfileApi: ServiceBuilder<typeof serviceWorkerName>
}): ServiceBuilder<typeof serviceWorkerName> =>
  service(serviceWorkerName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceWorkerName)
    .codeOwner(CodeOwners.Juni)
    .command('node')
    .args('--no-experimental-fetch', 'main.cjs', '--job=worker')
    .db()
    .migrations()
    .redis()
    .env({
      ...getEnv(services),
      EMAIL_REGION: 'eu-west-1',
      CONTENTFUL_HOST: {
        dev: 'preview.contentful.com',
        staging: 'cdn.contentful.com',
        prod: 'cdn.contentful.com',
      },
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '384Mi',
      },
      requests: {
        cpu: '150m',
        memory: '256Mi',
      },
    })
    .replicaCount({
      min: 1,
      max: 2,
      default: 1,
    })
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      IDENTITY_SERVER_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistryB2C, RskCompanyInfo)
    .liveness('/liveness')
    .readiness('/health/check')

export const userNotificationCleanUpWorkerSetup = (): ServiceBuilder<
  typeof serviceCleanupWorkerName
> =>
  service(serviceCleanupWorkerName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceCleanupWorkerName)
    .codeOwner(CodeOwners.Juni)
    .command('node')
    .args('--no-experimental-fetch', 'main.cjs', '--job=cleanup')
    .db({ name: 'user-notification' })
    .migrations()
    .extraAttributes({
      dev: { schedule: '@hourly' },
      staging: { schedule: '@midnight' },
      prod: { schedule: '@midnight' },
    })

export const userNotificationBirthdayWorkerSetup = (services: {
  userProfileApi: ServiceBuilder<'service-portal-api'>
}): ServiceBuilder<typeof serviceBirthdayWorkerName> =>
  service(serviceBirthdayWorkerName)
    .image(imageName)
    .namespace(serviceName)
    .serviceAccount(serviceBirthdayWorkerName)
    .codeOwner(CodeOwners.Juni)
    .db({ name: 'user-notification' })
    .command('node')
    .args(
      '--no-experimental-fetch',
      'main.cjs',
      '--job=worker',
      '--isBirthdayWorker',
    )
    .redis()
    .env({ ...getEnv(services) })
    .secrets({
      FIREBASE_CREDENTIALS: `/k8s/${serviceName}/firestore-credentials`,
      CONTENTFUL_ACCESS_TOKEN: `/k8s/${serviceName}/CONTENTFUL_ACCESS_TOKEN`,
      IDENTITY_SERVER_CLIENT_ID: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_ID`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/USER_NOTIFICATION_CLIENT_SECRET`,
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .resources({
      limits: {
        cpu: '400m',
        memory: '384Mi',
      },
      requests: {
        cpu: '150m',
        memory: '256Mi',
      },
    })
    .xroad(Base, Client, NationalRegistryB2C, RskCompanyInfo)
    .extraAttributes({
      dev: { schedule: '0 12 * * *' }, // 12 at noon every day
      staging: { schedule: '@midnight' },
      prod: { schedule: '@midnight' },
    })
