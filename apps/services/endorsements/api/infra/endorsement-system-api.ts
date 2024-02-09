import { service, ServiceBuilder } from '../../../../../infra/src/dsl/dsl'
import { settings } from '../../../../../infra/src/dsl/settings'
import {
  Base,
  Client,
  NationalRegistry,
} from '../../../../../infra/src/dsl/xroad'

export const serviceSetup =
  (_services: {}): ServiceBuilder<'endorsement-system-api'> =>
    service('endorsement-system-api')
      .image('services-endorsements-api')
      .namespace('endorsement-system')
      .serviceAccount('endorsement-system-api')
      .command('node')
      .args('--tls-min-v1.0', '--no-experimental-fetch', 'main.js')
      .db({ name: 'services_endorsements_api' })
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
        SOFFIA_HOST_URL: '/k8s/endorsement-system-api/SOFFIA_HOST_URL',
        SOFFIA_SOAP_URL: '/k8s/endorsement-system-api/SOFFIA_SOAP_URL',
        SOFFIA_USER: settings.SOFFIA_USER,
        SOFFIA_PASS: settings.SOFFIA_PASS,
      })
      .grantNamespaces('islandis', 'application-system')
      .xroad(Base, Client, NationalRegistry)
      .liveness('/liveness')
      .readiness('/liveness')
