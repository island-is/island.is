import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'hlc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'hlc.application:confirmation.general.alertTitle',
      defaultMessage: 'Vottorð vegna starfsleyfis hefur verið útbúið / sent',
      description: 'Confirmation alert title',
    },
    alertMessage: {
      id: 'hlc.application:confirmation.general.alertMessage',
      defaultMessage: 'Þú getur nú nálgast vottorðið inni á mínum síðum',
      description: 'Confirmation alert message',
    },
  }),
}
