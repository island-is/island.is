import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/icelandic-names-registry-backend/DB_PASSWORD',
}
export const serviceSetup =
  (): ServiceBuilder<'icelandic-names-registry-backend'> =>
    service('icelandic-names-registry-backend')
      .namespace('icelandic-names-registry')
      .postgres(postgresInfo)
      .initContainer({
        containers: [
          {
            name: 'migrations',
            command: 'npx',
            args: ['sequelize-cli', 'db:migrate'],
          },
          {
            name: 'seeds',
            command: 'npx',
            args: ['sequelize-cli', 'db:seed:all'],
          },
        ],
        postgres: postgresInfo,
      })
      .env({
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
      })
      .grantNamespaces('islandis')
      .liveness('/liveness')
      .readiness('/liveness')
