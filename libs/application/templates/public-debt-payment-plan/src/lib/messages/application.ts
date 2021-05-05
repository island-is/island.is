import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

// Global string for the application
export const application = defineMessages({
  name: {
    id: `${t}:application.name`,
    defaultMessage: 'Umsókn um greiðsludreifingu skulda',
    description: 'Name of the Login Service application',
  },
  description: {
    id: `${t}:application.description`,
    defaultMessage: 'Lýsing á umsókn um greiðsludreifingu skulda',
    description: 'Description of the Login Service application',
  },
})

// All sections in the application
export const section = defineMessages({
  stepOne: {
    id: `${t}:section.stepOne`,
    defaultMessage: 'Skref eitt',
    description: 'Skref eitt',
  },
})
