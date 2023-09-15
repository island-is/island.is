import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: `ls.application:application.name`,
    defaultMessage: 'Umsókn um innskráningarþjónustu',
    description: 'Name of the Login Service application',
  },
  description: {
    id: `ls.application:application.description`,
    defaultMessage: 'Lýsing á umsókn um innskráningarþjónustu',
    description: 'Description of the Login Service application',
  },
  institutionName: {
    id: `ls.application:application.institutionName`,
    defaultMessage: 'Stafrænt Ísland',
    description: 'Name of the Login Service application institution',
  },
})

// All sections in the application
export const section = defineMessages({
  terms: {
    id: `ls.application:section.terms`,
    defaultMessage: 'Skilmálar',
    description: 'Terms Section Title',
  },
  selectCompany: {
    id: `ls.application:section.selectCompany`,
    defaultMessage: 'Upplýsingar um fyrirtæki',
    description: 'Select Copmany Section Title',
  },
  applicant: {
    id: `ls.application:section.applicant`,
    defaultMessage: 'Upplýsingar um umsækjanda',
    description: 'Applicant Section Title',
  },
  technicalContact: {
    id: `ls.application:section.technicalContact`,
    defaultMessage: 'Tæknilegar tilkynningar',
    description: 'Technical Contact Section Title',
  },
  overview: {
    id: `ls.application:section.overview`,
    defaultMessage: 'Yfirlit umsóknar',
    description: 'Overview Section Title',
  },
  submitted: {
    id: `ls.application:section.submitted`,
    defaultMessage: 'Umsókn staðfest',
    description: 'Submitted Section Title',
  },
})
