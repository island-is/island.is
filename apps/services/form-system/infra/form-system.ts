import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  NationalRegistry,
  NationalRegistryB2C,
} from '../../../../infra/src/dsl/xroad'

const serviceName = 'services-form-system-api'

export const serviceSetup = (): ServiceBuilder<typeof serviceName> =>
  service(serviceName)
    .image(serviceName)
    .namespace(serviceName)
    .codeOwner(CodeOwners.Advania)
    .db()
    .migrations()
    .secrets({
      NATIONAL_REGISTRY_B2C_CLIENT_SECRET:
        '/k8s/api/NATIONAL_REGISTRY_B2C_CLIENT_SECRET',
    })
    .xroad(Base, Client, NationalRegistry, NationalRegistryB2C)

    .env({
      COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
        dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
        staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
        prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
      },
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .ingress({
      primary: {
        host: {
          dev: ['beta'],
          staging: ['beta'],
          prod: ['', 'www.island.is'],
        },
        paths: ['/form-api'],
        public: true,
      },
    })
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-external')
