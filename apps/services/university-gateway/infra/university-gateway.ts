import {
  CodeOwners,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  UniversityGatewayUniversityOfIceland,
  UniversityGatewayUniversityOfAkureyri,
  UniversityGatewayBifrostUniversity,
  UniversityGatewayIcelandUniversityOfTheArts,
  UniversityGatewayAgriculturalUniversityOfIceland,
  UniversityGatewayHolarUniversity,
  UniversityGatewayReykjavikUniversity,
} from '../../../../infra/src/dsl/xroad'

const serviceName = 'services-university-gateway'
const serviceWorkerName = `${serviceName}-worker`
const namespace = serviceName
const imageName = serviceName

export const serviceSetup = (): ServiceBuilder<typeof serviceName> => {
  return service(serviceName)
    .serviceAccount(serviceName)
    .namespace(namespace)
    .image(imageName)
    .codeOwner(CodeOwners.Origo)
    .command('node')
    .redis()
    .args('main.cjs')
    .resources({
      limits: { cpu: '200m', memory: '384Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/university-gateway',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/IDENTITY_SERVER_CLIENT_SECRET`,
    })
    .xroad(
      Base,
      Client,
      UniversityGatewayUniversityOfIceland,
      UniversityGatewayUniversityOfAkureyri,
      UniversityGatewayBifrostUniversity,
      UniversityGatewayIcelandUniversityOfTheArts,
      UniversityGatewayAgriculturalUniversityOfIceland,
      UniversityGatewayHolarUniversity,
      UniversityGatewayReykjavikUniversity,
    )
    .db()
    .migrations()
    .seed()
    .ingress({
      primary: {
        host: {
          dev: serviceName,
          staging: serviceName,
          prod: serviceName,
        },
        paths: ['/api'],
        public: false,
      },
    })
    .replicaCount({
      default: 2,
      min: 2,
      max: 10,
    })
    .liveness('/liveness')
    .readiness('/liveness')
    .grantNamespaces('islandis', 'nginx-ingress-internal', 'application-system')
}

export const workerSetup = (): ServiceBuilder<typeof serviceWorkerName> => {
  return service(serviceWorkerName)
    .serviceAccount(serviceWorkerName)
    .namespace(namespace)
    .image(imageName)
    .codeOwner(CodeOwners.Origo)
    .command('node')
    .redis()
    .args('main.cjs', '--job', 'worker')
    .resources({
      limits: { cpu: '200m', memory: '384Mi' },
      requests: { cpu: '50m', memory: '256Mi' },
    })
    .env({
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/university-gateway',
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/${serviceName}/IDENTITY_SERVER_CLIENT_SECRET`,
    })
    .xroad(
      Base,
      Client,
      UniversityGatewayUniversityOfIceland,
      UniversityGatewayUniversityOfAkureyri,
      UniversityGatewayBifrostUniversity,
      UniversityGatewayIcelandUniversityOfTheArts,
      UniversityGatewayAgriculturalUniversityOfIceland,
      UniversityGatewayHolarUniversity,
      UniversityGatewayReykjavikUniversity,
    )
    .db()
    .extraAttributes({
      // Schedule to run hourly at minute :00 (while testing)
      dev: { schedule: '0 * * * *' },
      // Schedule to run daily at two in the morning:
      staging: { schedule: '0 2 * * *' },
      prod: { schedule: '0 * * * *' },
    })
}
