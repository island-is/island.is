import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    pageTitle: {
      id: 'ta.ovlp.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Overview page title',
    },
    description: {
      id: 'ta.ovlp.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Overview page description',
    },
  }),
  labels: defineMessages({
    vehicle: {
      id: 'ta.ovlp.application:overview.labels.vehicle',
      defaultMessage: 'Ökutæki',
      description: 'Overview vehicle label',
    },
    plateType: {
      id: 'ta.ovlp.application:overview.labels.plateType',
      defaultMessage: 'Tegund númeraplötu',
      description: 'Overview plate type label',
    },
    plateSize: {
      id: 'ta.ovlp.application:overview.labels.plateSize',
      defaultMessage: 'Stærð númeraplötu',
      description: 'Overview plate size label',
    },
    frontPlateSize: {
      id: 'ta.ovlp.application:overview.labels.frontPlateSize',
      defaultMessage: 'Að framan',
      description: 'Overview front plate size label',
    },
    rearPlateSize: {
      id: 'ta.ovlp.application:overview.labels.rearPlateSize',
      defaultMessage: 'Að aftan',
      description: 'Overview rear plate size label',
    },
    plateDelivery: {
      id: 'ta.ovlp.application:overview.labels.plateDelivery',
      defaultMessage: 'Afhending númeraplötu',
      description: 'Overview plate delivery label',
    },
    rushFee: {
      id: 'ta.ovlp.application:overview.labels.rushFee',
      defaultMessage: 'Flýtimeðferð',
      description: 'Overview rush fee label',
    },
    rushFeeYes: {
      id: 'ta.ovlp.application:overview.labels.rushFeeYes',
      defaultMessage: 'Já',
      description: 'Overview rush fee yes',
    },
    rushFeeNo: {
      id: 'ta.ovlp.application:overview.labels.rushFeeNo',
      defaultMessage: 'Nei',
      description: 'Overview rush fee no',
    },
  }),
}
