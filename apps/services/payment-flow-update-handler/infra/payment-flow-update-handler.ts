import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

const namespace = 'services-payment-flow-update-handler'
const serviceName = namespace
const imageName = namespace

export const serviceSetup =
  (): ServiceBuilder<'services-payment-flow-update-handler'> =>
    service(serviceName)
      .image(imageName)
      .namespace(namespace)
      .env({
        PAYMENTS_WEB_URL: {
          dev: ref(
            (ctx) =>
              `https://${
                ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
              }beta.dev01.devland.is/greida`,
          ),
          staging: `https://beta.staging01.devland.is/greida`,
          prod: `https://island.is/greida`,
        },
        PAYMENT_FLOW_UPDATE_HANDLER_API_URL: ref(
          (ctx) =>
            `http://${serviceName}.${
              ctx.featureDeploymentName
                ? `${ctx.featureDeploymentName}`
                : namespace
            }.svc.cluster.local`,
        ),
        LANDSPITALI_WEB_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL_SUBJECT: {
          dev: '[TEST] Minningarkort - Landspítali',
          staging: '[TEST] Minningarkort - Landspítali',
          prod: 'Minningarkort - Landspítali',
        },
        LANDSPITALI_WEB_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL_SUBJECT: {
          dev: '[TEST] Beinn styrkur - Landspítali',
          staging: '[TEST] Beinn styrkur - Landspítali',
          prod: 'Beinn styrkur - Landspítali',
        },
        LANDSPITALI_WEB_PAYMENT_CONFIRMATION_SEND_FROM_EMAIL: {
          dev: 'development@island.is',
          staging: 'development@island.is',
          prod: 'island@island.is',
        },
      })
      .secrets({
        LANDSPITALI_WEB_PAYMENT_CONFIRMATION_SEND_TO_EMAIL:
          '/k8s/api/LANDSPITALI_PAYMENT_CONFIRMATION_SEND_TO_EMAIL',
      })
      .liveness('/liveness')
      .readiness('/health/check')
      .grantNamespaces('services-payments')
      .codeOwner(CodeOwners.Stefna)
      .ingress({
        internal: {
          host: {
            dev: serviceName,
            staging: serviceName,
            prod: serviceName,
          },
          paths: ['/'],
          public: false,
        },
      })
