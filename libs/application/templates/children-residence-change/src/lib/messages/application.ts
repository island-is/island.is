import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'crc.application:application.name',
    defaultMessage: 'Breytt lögheimili barna',
    description: 'Name of the Children Residence Change application',
  },
  signature: {
    id: 'crc.application:application.signature',
    defaultMessage: 'Skrifa undir umsókn',
    description: 'Button text for signing application',
  },
})

export const copyUrl = defineMessages({
  title: {
    id: 'crc.application:copyUrl.title',
    defaultMessage: 'Deila hlekk',
    description: 'Copy url title',
  },
  inputLabel: {
    id: 'crc.application:copyUrl.inputLabel',
    defaultMessage: 'Hlekkur á umsóknina',
    description: 'Copy url input label',
  },
  buttonLabel: {
    id: 'crc.application:copyUrl.buttonLabel',
    defaultMessage: 'Afrita hlekk',
    description: 'Copy url button text',
  },
  successMessage: {
    id: 'crc.application:copyUrl.successMessage',
    defaultMessage: 'Hlekkur afritaður',
    description: 'Copy url success text',
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
