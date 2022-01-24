import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { settings } from '../../../../infra/src/dsl/settings'

export const serviceSetup = (): ServiceBuilder<'regulations-admin-backend'> =>
  service('regulations-admin-backend')
    .image('regulations-admin-backend')
    .namespace('regulations-admin')
    .postgres()
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
    })
    .secrets({
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      SOFFIA_SOAP_URL: '/k8s/api/SOFFIA_SOAP_URL',
      SOFFIA_HOST_URL: '/k8s/api/SOFFIA_HOST_URL',
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .readiness('/liveness')
    .liveness('/liveness')
