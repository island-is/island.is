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
  externalData: {
    id: `${t}:section.externalData`,
    defaultMessage: 'Gagnaöflun',
    description: 'External data section',
  },
  info: {
    id: `${t}:section.info`,
    defaultMessage: 'Upplýsingar',
    description: 'Info section',
  },
  employer: {
    id: `${t}:section.employer`,
    defaultMessage: 'Launagreiðandi',
    description: 'Employer section',
  },
  paymentPlan: {
    id: `${t}:section.paymentPlan`,
    defaultMessage: 'Greiðsludreifing',
    description: 'Payment plan section',
  },
  overview: {
    id: `${t}:section.overview`,
    defaultMessage: 'Yfirlit og rafræn undirskrift',
    description: 'Overview and e-signature section',
  },
  confirmation: {
    id: `${t}:section.confirmation`,
    defaultMessage: 'Staðfesting',
    description: 'Confirmation section',
  },
})
