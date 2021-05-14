import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'

const postgresInfo = {
  passwordSecret: '/k8s/endorsement-system-api/DB_PASSWORD',
}
export const serviceSetup = (): ServiceBuilder<'endorsement-system-api'> =>
  service('endorsement-system-api')
    .image('endorsement-system-api')
    .namespace('endorsement-system')
    .postgres(postgresInfo)
    .initContainer({
      containers: [
        {
          name: 'migrations',
          command: 'npx',
          args: ['sequelize-cli', 'db:migrate'],
        },
      ],
      postgres: postgresInfo,
    })
    .env({
      SOFFIA_SOAP_URL: settings.SOFFIA_SOAP_URL,
      SOFFIA_HOST_URL: settings.SOFIA_HOST_URL,
    })
    .secrets({
      SOFFIA_USER: settings.SOFFIA_USER,
      SOFFIA_PASS: settings.SOFFIA_PASS,
    })
    .grantNamespaces('islandis')
    .liveness('/liveness')
    .readiness('/liveness')
