import { defineMessages, defineMessage } from 'react-intl'

// Global string for the application
export const application = defineMessage({
  name: {
    id: 'jca.application:application.name',
    defaultMessage: 'Samningur um sameiginlega forsjá',
    description: 'Name of the Joint custody agreement application',
  },
})

// All sections in the application
export const section = defineMessages({
  backgroundInformation: {
    id: 'jca.application:section.backgroundInformation',
    defaultMessage: 'Grunnupplýsingar',
    description: 'Background information',
  },
  arrangement: {
    id: 'jca.application:section.arrangement',
    defaultMessage: 'Fyrirkomulag',
    description: 'Arrangement',
  },
})
