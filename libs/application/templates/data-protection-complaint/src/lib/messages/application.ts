import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'dpac.application:application.name',
    defaultMessage: 'Kvörtun til Persónuverndar',
    description: 'Name of the Data Protection Authority Complaint application',
  },
})

// All sections in the application
export const section = defineMessages({
  delimitation: {
    id: 'dpac.application:section.delimitation',
    defaultMessage: 'Afmörkun kvörtunar',
    description: 'Delimitation of the complaint',
  },
  authorities: {
    id: 'dpac.application:section.authorities',
    defaultMessage: 'Stjórnvöld',
    description: 'Is the complaint being handles by the authorities',
  },
  media: {
    id: 'dpac.application:section.media',
    defaultMessage: 'Fjölmiðlar',
    description: 'Complaint regards media coverage',
  },
  banMarking: {
    id: 'dpac.application:section.banMarking',
    defaultMessage: 'Bannmerking',
    description: 'Complaint regards ban marking in the phone book',
  },
  libel: {
    id: 'dpac.application:section.libel',
    defaultMessage: 'Meiðyrði',
    description: 'Complaint regards libel',
  },
  info: {
    id: 'dpac.application:section.info',
    defaultMessage: 'Upplýsingar',
    description: 'Info',
  },
  onBehalf: {
    id: 'dpac.application:section.onBehalf',
    defaultMessage: 'Fyrir hvern',
    description: 'Details about on behalf of whom the complaint is registered',
  },
  applicant: {
    id: 'dpac.application:section.applicant',
    defaultMessage: 'Upplýsingar um þig',
    description: 'Details about the applicant',
  },
  complaint: {
    id: 'dpac.application:section.complaint',
    defaultMessage: 'Kvörtun',
    description: 'Complaint',
  },
  overview: {
    id: 'dpac.application:section.overview',
    defaultMessage: 'Yfirlit og samþykki',
    description: 'Overview and approval',
  },
  received: {
    id: 'dpac.application:section.received',
    defaultMessage: 'Staðfesting',
    description: 'Application Received',
  },
})
