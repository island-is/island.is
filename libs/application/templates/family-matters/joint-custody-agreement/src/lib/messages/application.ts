import { defineMessages, defineMessage } from 'react-intl'

// Global string for the application
export const application = defineMessage({
  name: {
    id: 'jca.application:application.name',
    defaultMessage: 'Samningur um sameiginlega forsjá',
    description: 'Name of the Joint custody agreement application',
  },
  signature: {
    id: 'jca.application:application.signature',
    defaultMessage: 'Skrifa undir umsókn',
    description: 'Button text for signing application',
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
  effect: {
    id: 'jca.application:section.effect',
    defaultMessage: 'Áhrif umsóknar',
    description: 'Effect of Application',
  },
  overview: {
    id: 'jca.application:section.overview',
    defaultMessage: 'Yfirlit og undirritun',
    description: 'Overview and Signing',
  },
  received: {
    id: 'jca.application:section.received',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application Received',
  },
})
