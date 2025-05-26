import { defineMessages } from 'react-intl'

export const convoy = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:convoy.general.sectionTitle',
      defaultMessage: 'Vagnlest',
      description: 'Title of convoy section',
    },
    pageTitle: {
      id: 'ta.eft.application:convoy.general.pageTitle',
      defaultMessage: 'Veldu ökutæki sem á að nota við flutninginn',
      description: 'Title of convoy page',
    },
    description: {
      id: 'ta.eft.application:convoy.general.description',
      defaultMessage:
        'Hér að neðan skaltu velja þau ökutæki sem verða notuð við flutning.  Hægt er að velja eitt ökutæki eða eitt ökutæki og einn eftirvagn.',
      description: 'Description of convoy page',
    },
  }),
  labels: defineMessages({
    vehiclePermno: {
      id: 'ta.eft.application:convoy.labels.vehiclePermno',
      defaultMessage: 'Fastanúmer ökutækis',
      description: 'Vehicle permno label',
    },
    vehicleMakeAndColor: {
      id: 'ta.eft.application:convoy.labels.vehicleMakeAndColor',
      defaultMessage: 'Tegund og litur ökutækis',
      description: 'Vehicle make and color label',
    },
    trailerPermno: {
      id: 'ta.eft.application:convoy.labels.trailerPermno',
      defaultMessage: 'Fastanúmer eftirvagns',
      description: 'Trailer permno label',
    },
    trailerMakeAndColor: {
      id: 'ta.eft.application:convoy.labels.trailerMakeAndColor',
      defaultMessage: 'Tegund og litur eftirvagns',
      description: 'Trailer make and color label',
    },
  }),
  error: defineMessages({
    alertTitle: {
      id: 'ta.eft.application:convoy.error.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Convoy error alert title',
    },
    notInOrder: {
      id: 'ta.eft.application:convoy.error.notInOrder',
      defaultMessage: 'Ökutæki er ekki í lagi',
      description: 'Convoy error vehicle is not in order alert message',
    },
    notInspected: {
      id: 'ta.eft.application:convoy.error.notInspected',
      defaultMessage: 'Ökutæki er ekki skoðað',
      description: 'Convoy error vehicle is not inspected alert message',
    },
    notInAllowedGroup: {
      id: 'ta.eft.application:convoy.error.notInAllowedGroup',
      defaultMessage: 'Ökutæki ekki í leyfðum ökutækjaflokki',
      description: 'Convoy error vehicle is not in allowed group alert message',
    },
    notInAllowedUseGroup: {
      id: 'ta.eft.application:convoy.error.notInAllowedUseGroup',
      defaultMessage: 'Ökutæki er ekki í leyfðum notkunarflokki',
      description:
        'Convoy error vehicle is not in allowed use group alert message',
    },
    notTrailer: {
      id: 'ta.eft.application:convoy.error.notTrailer',
      defaultMessage:
        'Ætti að vera eftirvagn, en þetta bílnúmer er ekki fyrir eftirvagn',
      description: 'Convoy error vehicle is not a trailer alert message',
    },
    shouldNotBeTrailer: {
      id: 'ta.eft.application:convoy.error.shouldNotBeTrailer',
      defaultMessage:
        'Ætti að vera ökutæki, en þetta bílnúm er fyrir eftirvagn',
      description: 'Convoy error vehicle should not be a trailer alert message',
    },
    notFound: {
      id: 'ta.eft.application:convoy.error.notFound',
      defaultMessage: 'Ökutæki fannst ekki',
      description: 'Convoy error vehicle is not found alert message',
    },
    fallbackErrorMessage: {
      id: 'ta.eft.application:convoy.error.fallbackErrorMessage',
      defaultMessage: 'Það kom upp villa',
      description: 'Convoy error fallback alert message',
    },
    validationFailedErrorMessage: {
      id: 'ta.eft.application:convoy.error.validationFailedErrorMessage',
      defaultMessage:
        'Það kom upp villa við að athuga hvort ökutæki sé leyfilegt',
      description: 'Convoy error validation failed alert message',
    },
  }),
}
