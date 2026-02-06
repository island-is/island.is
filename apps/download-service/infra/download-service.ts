import { ServiceBuilder, ref, service } from '../../../infra/src/dsl/dsl'
import {
  Base,
  Client,
  DistrictCommissionersLicenses,
  DistrictCommissionersPCard,
  Education,
  Finance,
  HealthInsurance,
  RentalService,
  UniversityCareers,
  Vehicles,
  WorkMachines,
} from '../../../infra/src/dsl/xroad'

export const serviceSetup = (services: {
  regulationsAdminBackend: ServiceBuilder<'regulations-admin-backend'>
}): ServiceBuilder<'download-service'> =>
  service('download-service')
    .image('download-service')
    .namespace('download-service')
    .serviceAccount('download-service')
    .env({
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      IDENTITY_SERVER_CLIENT_ID: '@island.is/clients/download-service',
      REGULATIONS_ADMIN_URL: ref(
        (h) => `http://${h.svc(services.regulationsAdminBackend)}`,
      ),
    })
    .secrets({
      IDENTITY_SERVER_CLIENT_SECRET:
        '/k8s/download-service/IDENTITY_SERVER_CLIENT_SECRET',
      POSTHOLF_CLIENTID: '/k8s/documents/POSTHOLF_CLIENTID',
      POSTHOLF_CLIENT_SECRET: '/k8s/documents/POSTHOLF_CLIENT_SECRET',
      POSTHOLF_TOKEN_URL: '/k8s/documents/POSTHOLF_TOKEN_URL',
      POSTHOLF_BASE_PATH: '/k8s/documents/POSTHOLF_BASE_PATH',
      REGULATIONS_API_URL: '/k8s/api/REGULATIONS_API_URL',
      REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PRESIGNED',
      REGULATIONS_FILE_UPLOAD_KEY_DRAFT:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_DRAFT',
      REGULATIONS_FILE_UPLOAD_KEY_PUBLISH:
        '/k8s/api/REGULATIONS_FILE_UPLOAD_KEY_PUBLISH',
      HMS_CONTRACTS_AUTH_CLIENT_SECRET:
        '/k8s/application-system-api/HMS_CONTRACTS_AUTH_CLIENT_SECRET',
    })
    .xroad(
      Base,
      Client,
      Finance,
      HealthInsurance,
      Vehicles,
      UniversityCareers,
      WorkMachines,
      Education,
      DistrictCommissionersPCard,
      DistrictCommissionersLicenses,
      RentalService,
    )
    .ingress({
      primary: {
        extraAnnotations: {
          dev: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          staging: {
            'nginx.ingress.kubernetes.io/enable-global-auth': 'false',
          },
          prod: {},
        },
        host: {
          dev: ['api'],
          staging: ['api'],
          prod: ['api'],
        },
        paths: ['/download'],
        public: true,
      },
    })
    .liveness('download/v1/liveness')
    .readiness('download/v1/readiness')
    .grantNamespaces(
      'islandis',
      'nginx-ingress-external',
      'services-bff-portals-admin',
    )
    .resources({
      limits: { cpu: '400m', memory: '512Mi' },
      requests: { cpu: '200m', memory: '256Mi' },
    })
