import {
  CodeOwners,
  json,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  EnvironmentVariables,
  Secrets,
} from '../../../../infra/src/dsl/types/input-types'
import {
  Base,
  Client,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'

const namespace = 'service-portal'
const serviceId = `${namespace}-api`
const imageId = 'services-user-profile'

const envVariables: EnvironmentVariables = {
  SERVICE_PORTAL_BASE_URL: {
    dev: 'https://beta.dev01.devland.is/minarsidur',
    staging: 'https://beta.staging01.devland.is/minarsidur',
    prod: 'https://island.is/minarsidur',
    local: 'http://localhost:4200/minarsidur',
  },
  EMAIL_REGION: 'eu-west-1',
  IDENTITY_SERVER_ISSUER_URL: {
    dev: 'https://identity-server.dev01.devland.is',
    staging: 'https://identity-server.staging01.devland.is',
    prod: 'https://innskra.island.is',
  },
  NOVA_ACCEPT_UNAUTHORIZED: {
    dev: 'true',
    staging: 'false',
    prod: 'false',
  },
  AUTH_DELEGATION_API_URL: {
    dev: 'https://auth-delegation-api.internal.identity-server.dev01.devland.is',
    staging:
      'http://services-auth-delegation-api.identity-server-delegation.svc.cluster.local',
    prod: 'https://auth-delegation-api.internal.innskra.island.is',
  },
  AUTH_DELEGATION_MACHINE_CLIENT_SCOPE: json([
    '@island.is/auth/delegations/index:system',
  ]),
}

const secrets: Secrets = {
  NOVA_URL: '/k8s/service-portal-api/NOVA_URL',
  NOVA_PASSWORD: '/k8s/gjafakort/NOVA_PASSWORD',
  NOVA_USERNAME: '/k8s/gjafakort/NOVA_USERNAME',
  EMAIL_FROM: '/k8s/service-portal/api/EMAIL_FROM',
  EMAIL_FROM_NAME: '/k8s/service-portal/api/EMAIL_FROM_NAME',
  EMAIL_REPLY_TO: '/k8s/service-portal/api/EMAIL_REPLY_TO',
  EMAIL_REPLY_TO_NAME: '/k8s/service-portal/api/EMAIL_REPLY_TO_NAME',
  ISLYKILL_SERVICE_PASSPHRASE: '/k8s/api/ISLYKILL_SERVICE_PASSPHRASE',
  ISLYKILL_SERVICE_BASEPATH: '/k8s/api/ISLYKILL_SERVICE_BASEPATH',
  IDENTITY_SERVER_CLIENT_ID: `/k8s/service-portal/api/SERVICE_PORTAL_API_CLIENT_ID`,
  IDENTITY_SERVER_CLIENT_SECRET: `/k8s/service-portal/api/SERVICE_PORTAL_API_CLIENT_SECRET`,
  NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
    '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
}

export const serviceSetup = (): ServiceBuilder<typeof serviceId> =>
  service(serviceId)
    .namespace(namespace)
    .image(imageId)
    .serviceAccount(serviceId)
    .codeOwner(CodeOwners.Aranja)
    .env(envVariables)
    .secrets(secrets)
    .xroad(Base, Client, NationalRegistryB2C)
    .migrations()
    .liveness('/liveness')
    .readiness('/readiness')
    .replicaCount({
      default: 2,
      max: 30,
      min: 2,
    })
    .files({ filename: 'islyklar.p12', env: 'ISLYKILL_CERT' })
    .ingress({
      internal: {
        host: {
          dev: 'service-portal-api',
          staging: 'service-portal-api',
          prod: 'service-portal-api',
        },
        paths: ['/'],
        public: false,
      },
    })
    .resources({
      limits: { cpu: '800m', memory: '1024Mi' },
      requests: { cpu: '100m', memory: '512Mi' },
    })
    .db()
    .grantNamespaces(
      'nginx-ingress-internal',
      'islandis',
      'user-notification',
      'identity-server',
      'application-system',
    )
