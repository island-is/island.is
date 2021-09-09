import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import { PostgresInfo } from '../../../../infra/src/dsl/types/input-types'

const postgresInfo: PostgresInfo = {
  passwordSecret: '/k8s/services-temporary-voter-registry-api/DB_PASSWORD',
  name: 'services_temporary_voter_registry_api',
  username: 'services_temporary_voter_registry_api',
}
export const serviceSetup = (): ServiceBuilder<'temporary-voter-registry-api'> =>
  service('temporary-voter-registry-api')
    .image('services-temporary-voter-registry-api')
    .namespace('temporary-voter-registry')
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
    .grantNamespaces('islandis', 'endorsement-system')
    .liveness('/liveness')
    .readiness('/liveness')
