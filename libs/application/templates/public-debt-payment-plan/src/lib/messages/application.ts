import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

// Global string for the application
export const application = defineMessages({
  name: {
    id: `pdpp.application:application.name`,
    defaultMessage: 'Umsókn um greiðsludreifingu skulda',
    description: 'Name of the Login Service application',
  },
  description: {
    id: `pdpp.application:application.description`,
    defaultMessage: 'Lýsing á umsókn um greiðsludreifingu skulda',
    description: 'Description of the Login Service application',
  },
})

// All sections in the application
export const section = defineMessages({
  externalData: {
    id: `pdpp.application:section.externalData`,
    defaultMessage: 'Gagnaöflun',
    description: 'External data section',
  },
  info: {
    id: `pdpp.application:section.info`,
    defaultMessage: 'Upplýsingar',
    description: 'Info section',
  },
  employer: {
    id: `pdpp.application:section.employer`,
    defaultMessage: 'Launagreiðandi',
    description: 'Employer section',
  },
  paymentPlan: {
    id: `pdpp.application:section.paymentPlan`,
    defaultMessage: 'Greiðsludreifing',
    description: 'Payment plan section',
  },
  overview: {
    id: `pdpp.application:section.overview`,
    defaultMessage: 'Yfirlit og rafræn undirskrift',
    description: 'Overview and e-signature section',
  },
  confirmation: {
    id: `pdpp.application:section.confirmation`,
    defaultMessage: 'Staðfesting',
    description: 'Confirmation section',
  },
})
