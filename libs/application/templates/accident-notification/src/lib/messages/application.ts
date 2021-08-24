import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'an.application:general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    institutionName: {
      id: 'an.application:application.institutionName',
      defaultMessage: 'Sjúkratryggingar Íslands',
      description: 'Sjúkratryggingar Íslands',
    },
    yesOptionLabel: {
      id: 'an.application:application.yesOptionLabel',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    noOptionLabel: {
      id: 'an.application:application.noOptionLabel',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  deliveryOfData: defineMessages({
    name: {
      id: 'an.application:deliveryOfData.name',
      defaultMessage: 'Afhending skjala',
      description: 'Delivery of data',
    },
  }),
}
