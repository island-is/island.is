import { service, ServiceBuilder } from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  ChargeFjsV2,
  RskCompanyInfo,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'

const namespace = 'services-payments'
const serviceName = namespace
const imageName = namespace

export const serviceSetup = (): ServiceBuilder<'services-payments'> =>
  service(serviceName)
    .namespace(namespace)
    .image(imageName)
    .db({
      extensions: ['uuid-ossp'],
    })
    .migrations()
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/payments',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      ISLANDIS_URL: {
        dev: 'https://beta.dev01.devland.is',
        staging: 'https://beta.staging01.devland.is',
        prod: 'https://island.is',
      },
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/services-payments/IDENTITY_SERVER_CLIENT_SECRET',
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/services-payments/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, ChargeFjsV2, RskCompanyInfo, NationalRegistryB2C)
    .readiness('/liveness')
    .liveness('/liveness')
    .grantNamespaces('nginx-ingress-internal', 'islandis')
