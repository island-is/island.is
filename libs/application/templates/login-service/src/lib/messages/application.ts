import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

// Global string for the application
export const application = defineMessages({
  name: {
    id: `${t}:application.name`,
    defaultMessage: 'Umsókn um innskráningarþjónustu',
    description: 'Name of the Login Service application',
  },
  description: {
    id: `${t}:application.description`,
    defaultMessage: 'Lýsing á umsókn um innskráningarþjónustu',
    description: 'Description of the Login Service application',
  },
})

// All sections in the application
export const section = defineMessages({
  terms: {
    id: `${t}:section.terms`,
    defaultMessage: 'Skilmálar',
    description: 'Terms Section Title',
  },
  applicant: {
    id: `${t}:section.applicant`,
    defaultMessage: 'Upplýsingar',
    description: 'Applicant Section Title',
  },
  technicalContact: {
    id: `${t}:section.technicalContact`,
    defaultMessage: 'Tæknilegar tengiliður',
    description: 'Technical Contact Section Title',
  },
  technicalInfo: {
    id: `${t}:section.technicalInfo`,
    defaultMessage: 'Tæknilegar upplýsingar',
    description: 'Technical Info Section Title',
  },
  overview: {
    id: `${t}:section.overview`,
    defaultMessage: 'Yfirlit umsóknar',
    description: 'Overview Section Title',
  },
  submitted: {
    id: `${t}:section.submitted`,
    defaultMessage: 'Umsókn staðfest',
    description: 'Submitted Section Title',
  },
})
