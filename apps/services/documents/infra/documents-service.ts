import { service, ServiceBuilder } from '../../../../libs/helm/dsl/dsl'

const postgresInfo = {
  passwordSecret: '/k8s/services-documents/DB_PASSWORD',
}

export const serviceSetup = (): ServiceBuilder<'services-documents'> =>
  service('services-documents')
    .image('services-documents')
    .namespace('services-documents')
    .env({
      AUDIT_GROUP_NAME: 'k8s/island-is/audit-log',
    })
    .initContainer({
      containers: [{ command: 'npx', args: ['sequelize-cli', 'db:migrate'] }],
      postgres: postgresInfo,
    })
    .liveness('/liveness')
    .readiness('/readiness')
    .postgres(postgresInfo)
    .grantNamespaces('islandis', 'application-system')
