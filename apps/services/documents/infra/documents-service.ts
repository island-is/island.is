import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/services-documents/DB_PASSWORD',
}

export const serviceSetup = (): ServiceBuilder<'services-documents'> =>
  service('services-documents')
    .namespace('services-documents')
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
      envs: {
        NO_UPDATE_NOTIFIER: 'true',
      },
    })
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      NO_UPDATE_NOTIFIER: 'true',
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .postgres(postgresInfo)
    .grantNamespaces('islandis', 'application-system')
