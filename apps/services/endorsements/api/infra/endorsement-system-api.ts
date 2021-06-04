import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'
import { PostgresInfo } from '../../../../../infra/src/dsl/types/input-types'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/services-endorsements-api/DB_PASSWORD',
  name: 'services_endorsements_api',
  username: 'services_endorsements_api',
}
export const serviceSetup = (): ServiceBuilder<'endorsement-system-api'> =>
  service('endorsement-system-api')
    .image('services-endorsements-api')
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
