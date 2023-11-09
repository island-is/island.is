import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'service-portal-api'> =>
  service('service-portal-api')
    .namespace('service-portal')
    .image({ name: 'services-user-profile' })
    .serviceAccount('service-portal-api')
    .env({
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
    })
    .secrets({
      NOVA_URL: '/k8s/service-portal-api/NOVA_URL',
      NOVA_PASSWORD: '/k8s/gjafakort/NOVA_PASSWORD',
      NOVA_USERNAME: '/k8s/gjafakort/NOVA_USERNAME',
      EMAIL_FROM: '/k8s/service-portal/api/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/service-portal/api/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/service-portal/api/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/service-portal/api/EMAIL_REPLY_TO_NAME',
      ISLYKILL_SERVICE_PASSPHRASE: '/k8s/api/ISLYKILL_SERVICE_PASSPHRASE',
      ISLYKILL_SERVICE_BASEPATH: '/k8s/api/ISLYKILL_SERVICE_BASEPATH',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: { passwordSecret: '/k8s/service-portal/api/DB_PASSWORD' },
    })
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
      requests: { cpu: '400m', memory: '512Mi' },
    })
    .postgres({ passwordSecret: '/k8s/service-portal/api/DB_PASSWORD' })
    .grantNamespaces(
      'nginx-ingress-internal',
      'islandis',
      'user-notification',
      'identity-server',
    )
