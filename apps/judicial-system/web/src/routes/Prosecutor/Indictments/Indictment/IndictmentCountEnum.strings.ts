import { defineMessages } from 'react-intl'

export const indictmentCountEnum = defineMessages({
  DRIVING_WITHOUT_LICENCE: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_enum.suspended_drivers_licence_v2',
    defaultMessage: 'Sviptingarakstur',
    description: 'Notaður sem titill á subtype fyrir "sviptingarakstur" brot.',
  },
  DRUNK_DRIVING: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_enum.drunk_driving_v2',
    defaultMessage: 'Ölvunarakstur',
    description: 'Notaður sem titill á subtype fyrir "ölvunarakstur" brot.',
  },
  ILLEGAL_DRUGS_DRIVING: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_enum.illegal_drugs_driving',
    defaultMessage: 'Fíkniefnaakstur',
    description: 'Notaður sem titill á subtype fyrir "fíkniefnaakstur" brot.',
  },
  PRESCRIPTION_DRUGS_DRIVING: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_enum.prescription_drugs_driving',
    defaultMessage: 'Lyfjaakstur',
    description: 'Notaður sem titill á subtype fyrir "lyfjaakstur" brot.',
  },
})
