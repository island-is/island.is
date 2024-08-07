import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  NationalRegistryB2C,
} from '../../../../../infra/src/dsl/xroad'

export const serviceSetup =
  (_services: {}): ServiceBuilder<'endorsement-system-api'> =>
    service('endorsement-system-api')
      .image('services-endorsements-api')
      .namespace('endorsement-system')
      .serviceAccount('endorsement-system-api')
      .command('node')
      .args('--tls-min-v1.0', '--no-experimental-fetch', 'main.js')
      .db({ name: 'services-endorsements-api' })
      .migrations()
      .env({
        EMAIL_REGION: 'eu-west-1',
        EMAIL_FROM_NAME: {
          dev: 'devland.is',
          staging: 'devland.is',
          prod: 'island.is',
        },
        EMAIL_FROM_ADDRESS: {
          dev: 'development@island.is',
          staging: 'development@island.is',
          prod: 'noreply@island.is',
        },
        IDENTITY_SERVER_ISSUER_URL: {
          dev: 'https://identity-server.dev01.devland.is',
          staging: 'https://identity-server.staging01.devland.is',
          prod: 'https://innskra.island.is',
        },
        IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/endorsement',
      })
      .secrets({
        IDENTITY_SERVER_CLIENT_SECRET:
          '/k8s/endorsement-system-api/IDS-shared-secret',
        NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
          '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
      })
      .grantNamespaces('islandis', 'application-system')
      .xroad(Base, Client, NationalRegistry, NationalRegistryB2C)
      .liveness('/liveness')
      .readiness('/liveness')

const serviceName = 'endorsement-system-api'
const serviceCleanupWorkerName = `${serviceName}-cleanup-worker`
export const endorsementSystemCleanUpWorkerSetup = (): ServiceBuilder<
  typeof serviceCleanupWorkerName
> =>
  service(serviceCleanupWorkerName)
    .image('services-endorsements-api')
    .namespace('endorsement-system')
    .serviceAccount(serviceCleanupWorkerName)
    .command('node')
    .args('--no-experimental-fetch', 'main.js', '--job=cleanup')
    .db({ name: 'services-endorsements-api' })
    .migrations()
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/endorsement-system-api/IDS-shared-secret',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistry, NationalRegistryB2C)
    .liveness('/liveness')
    .readiness('/liveness')
    .extraAttributes({
      dev: { schedule: '@hourly' },
      staging: { schedule: '@hourly' },
      prod: { schedule: '@hourly' },
    })
