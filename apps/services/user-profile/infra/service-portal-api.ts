import { ref, service, ServiceBuilder } from '../../../../libs/helm/dsl/dsl'

export const serviceSetup = (): ServiceBuilder<'service-portal-api'> =>
  service('service-portal-api')
    .namespace('service-portal')
    .image('services-user-profile')
    .serviceAccount('service-portal-api')
    .env({
      AUDIT_GROUP_NAME: 'k8s/island-is/audit-log',
      SERVICE_PORTAL_BASE_URL: {
        dev: 'https://beta.dev01.devland.is/minarsidur',
        staging: 'https://beta.staging01.devland.is/minarsidur',
        prod: 'https://island.is/minarsidur',
      },
      EMAIL_REGION: 'eu-west-1',
      NOVA_URL: {
        dev: 'https://smsapi.devnova.is',
        staging: 'https://smsapi.devnova.is',
        prod: 'https://smsapi.nova.is',
      },
    })
    .secrets({
      SENTRY_DSN: '/k8s/service-portal/SENTRY_DSN',
      NOVA_PASSWORD: '/k8s/gjafakort/NOVA_PASSWORD',
      NOVA_USERNAME: '/k8s/gjafakort/NOVA_USERNAME',
      EMAIL_FROM: '/k8s/service-portal/api/EMAIL_FROM',
      EMAIL_FROM_NAME: '/k8s/service-portal/api/EMAIL_FROM_NAME',
      EMAIL_REPLY_TO: '/k8s/service-portal/api/EMAIL_REPLY_TO',
      EMAIL_REPLY_TO_NAME: '/k8s/service-portal/api/EMAIL_REPLY_TO_NAME',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: { passwordSecret: '/k8s/service-portal/api/DB_PASSWORD' },
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .postgres({ passwordSecret: '/k8s/service-portal/api/DB_PASSWORD' })
    .grantNamespaces('nginx-ingress-external', 'islandis')
