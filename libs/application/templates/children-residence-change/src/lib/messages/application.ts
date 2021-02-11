import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'crc.application:application.name',
    defaultMessage: 'Breytt lögheimili barna',
    description: 'Name of the Children Residence Change application',
  },
})

// All sections in the application
export const section = defineMessages({
  backgroundInformation: {
    id: 'crc.application:section.backgroundInformation',
    defaultMessage: 'Grunnupplýsingar',
    description: 'Background information',
  },
  arrangement: {
    id: 'crc.application:section.arrangement',
    defaultMessage: 'Fyrirkomulag',
    description: 'Arrangement',
  },
  effect: {
    id: 'crc.application:section.effect',
    defaultMessage: 'Áhrif umsóknar',
    description: 'Effect of Application',
  },
  overview: {
    id: 'crc.application:section.overview',
    defaultMessage: 'Yfirlit og undirritun',
    description: 'Overview and Signing',
  },
  received: {
    id: 'crc.application:section.received',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application Received',
  },
})