import { defineMessages } from 'react-intl'

export const convoy = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:convoy.general.sectionTitle',
      defaultMessage: 'Ökutæki',
      description: 'Title of convoy section',
    },
    pageTitle: {
      id: 'ta.eft.application:convoy.general.pageTitle',
      defaultMessage: 'Ökutæki',
      description: 'Title of convoy page',
    },
    descriptionShortTerm: {
      id: 'ta.eft.application:convoy.general.descriptionShortTerm',
      defaultMessage:
        'Veldu hér að neðan þau ökutæki sem verða notuð við flutninginn. Þú getur annaðhvort valið bíl eða bíl með eftirvagni.',
      description: 'Description of convoy page for short-term',
    },
    descriptionLongTerm: {
      id: 'ta.eft.application:convoy.general.descriptionLongTerm',
      defaultMessage:
        'Veldu hér að neðan þau ökutæki sem verða notuð við flutninginn. Þú getur annaðhvort valið bíl eða bíl með eftirvagni. Ef notast er við fleiri bíla eða vagnlestir er hægt að bæta því við með því að velja Bæta við vagnlest.',
      description: 'Description of convoy page for long-term',
    },
  }),
  labels: defineMessages({
    vehiclePermno: {
      id: 'ta.eft.application:convoy.labels.vehiclePermno',
      defaultMessage: 'Fastanúmer bíls',
      description: 'Vehicle permno label',
    },
    vehicleMakeAndColor: {
      id: 'ta.eft.application:convoy.labels.vehicleMakeAndColor',
      defaultMessage: 'Tegund og litur bíls',
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
    addItemButtonText: {
      id: 'ta.eft.application:convoy.labels.addItemButtonText',
      defaultMessage: 'Bæta við vagnlest',
      description: 'Add item to convoy table button text',
    },
    saveItemButtonText: {
      id: 'ta.eft.application:convoy.labels.saveItemButtonText',
      defaultMessage: 'Skrá vagnlest',
      description: 'Save item to convoy table button text',
    },
    removeItemButtonTooltipText: {
      id: 'ta.eft.application:convoy.labels.removeItemTooltipText',
      defaultMessage: 'Eyða vagnlest',
      description: 'Remove item in convoy table button tooltip text',
    },
    editItemButtonTooltipText: {
      id: 'ta.eft.application:convoy.labels.editItemButtonTooltipText',
      defaultMessage: 'Breyta vagnlest',
      description: 'Edit item in convoy table button tooltip text',
    },
    convoyNumberTableHeader: {
      id: 'ta.eft.application:convoy.labels.convoyNumberTableHeader',
      defaultMessage: 'Vagnlest',
      description: 'Convoy number table header label',
    },
    vehicleTableHeader: {
      id: 'ta.eft.application:convoy.labels.vehicleTableHeader',
      defaultMessage: 'Bíll',
      description: 'Vehicle table header label',
    },
    trailerTableHeader: {
      id: 'ta.eft.application:convoy.labels.trailerTableHeader',
      defaultMessage: 'Eftirvagn',
      description: 'Trailer table header label',
    },
    convoyNumber: {
      id: 'ta.eft.application:convoy.labels.convoyNumber',
      defaultMessage: 'Vagnlest {number}',
      description: 'Convoy number label',
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
        'Ætti að vera eftirvagn, en þetta fastanúmer er ekki fyrir eftirvagn',
      description: 'Convoy error vehicle is not a trailer alert message',
    },
    shouldNotBeTrailer: {
      id: 'ta.eft.application:convoy.error.shouldNotBeTrailer',
      defaultMessage:
        'Ætti að vera bíll, en þetta fastanúmer er fyrir eftirvagn',
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
    emptyListErrorMessage: {
      id: 'ta.eft.application:convoy.error.emptyListErrorMessage',
      defaultMessage: 'Það verður að skrá a.m.k. eina vagnlest',
      description: 'Convoy error empty list alert message',
    },
    duplicateErrorMessage: {
      id: 'ta.eft.application:convoy.error.duplicateErrorMessage',
      defaultMessage:
        'Ekki má setja inn sömu samsetningu af bíl og eftirvagn oftar en einu sinni',
      description: 'Convoy error duplicate alert message',
    },
  }),
  dollyType: defineMessages({
    subtitle: {
      id: 'ta.eft.application:convoy.dollyType.subtitle',
      defaultMessage: 'Aukaásar',
      description: 'Convoy dolly type',
    },
    noneOptionTitle: {
      id: 'ta.eft.application:convoy.dollyType.noneOptionTitle',
      defaultMessage: 'Ekkert dollý',
      description: 'No dolly option title',
    },
    singleOptionTitle: {
      id: 'ta.eft.application:convoy.dollyType.singleOptionTitle',
      defaultMessage: 'Einfalt dollý',
      description: 'Single dolly option title',
    },
    doubleOptionTitle: {
      id: 'ta.eft.application:convoy.dollyType.doubleOptionTitle',
      defaultMessage: 'Tvöfalt dollý',
      description: 'Double dolly option title',
    },
  }),
}
