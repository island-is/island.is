import { defineMessages } from 'react-intl'

export const indictmentCountEnum = defineMessages({
  DRIVING_WITHOUT_LICENCE: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count_enum.suspended_drivers_licence',
    defaultMessage: 'Sviptingaakstur',
    description: 'Notaður sem titill á subtype fyrir "sviptingaakstur" brot.',
  },
  DRUNK_DRIVING: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count_enum.drunk_driving',
    defaultMessage: 'Áfengisakstur',
    description: 'Notaður sem titill á subtype fyrir "áfengisakstur" brot.',
  },
  ILLEGAL_DRUGS_DRIVING: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count_enum.illegal_drugs_driving',
    defaultMessage: 'Fíkniefnaakstur',
    description: 'Notaður sem titill á subtype fyrir "Fíkniefnaakstur" brot.',
  },
  PRESCRIPTION_DRUGS_DRIVING: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count_enum.prescription_drugs_driving',
    defaultMessage: 'Lyfjaakstur',
    description: 'Notaður sem titill á subtype fyrir "Lyfjaakstur" brot.',
  },
})
