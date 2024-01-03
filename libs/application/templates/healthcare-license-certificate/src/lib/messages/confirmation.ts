import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'hlc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    pageTitle: {
      id: 'hlc.application:confirmation.general.pageTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation page title',
    },
    alertTitle: {
      id: 'hlc.application:confirmation.general.alertTitle',
      defaultMessage: 'Vottorð vegna starfsleyfis hefur verið útbúið / sent',
      description: 'Confirmation alert title',
    },
    alertMessage: {
      id: 'hlc.application:confirmation.general.alertMessage',
      defaultMessage: 'Þú getur nálgast vottorðið á mínum síðum á island.is',
      description: 'Confirmation alert message',
    },
  }),
}
