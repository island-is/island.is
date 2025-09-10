import {
  CodeOwners,
  ref,
  service,
  ServiceBuilder,
} from '../../../../infra/src/dsl/dsl'

export const serviceSetup =
  (): ServiceBuilder<'payment-flow-update-handler'> => {
    const paymentFlowUpdateHandler = service('payment-flow-update-handler')

    return paymentFlowUpdateHandler
      .image('services-payment-flow-update-handler')
      .namespace('payment-flow-update-handler')
      .serviceAccount('payment-flow-update-handler')
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
            `http://payment-flow-update-handler.${
              ctx.featureDeploymentName
                ? `${ctx.featureDeploymentName}`
                : 'payment-flow-update-handler'
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
      .readiness('/readiness')
      .grantNamespaces('services-payments')
      .codeOwner(CodeOwners.Stefna)
      .ingress({
        internal: {
          host: {
            dev: 'payment-flow-update-handler',
            staging: 'payment-flow-update-handler',
            prod: 'payment-flow-update-handler',
          },
          paths: ['/'],
          public: false,
        },
      })
  }
