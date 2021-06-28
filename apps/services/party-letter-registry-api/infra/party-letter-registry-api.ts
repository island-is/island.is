import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { PostgresInfo } from '../../../../infra/src/dsl/types/input-types'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/services-party-letter-registry-api/DB_PASSWORD',
  name: 'services_party_letter_registry_api',
  username: 'services_party_letter_registry_api',
}
export const serviceSetup = (): ServiceBuilder<'party-letter-registry-api'> =>
  service('party-letter-registry-api')
    .image('services-party-letter-registry-api')
    .namespace('party-letter-registry')
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
    .grantNamespaces('islandis')
    .liveness('/liveness')
    .readiness('/liveness')
