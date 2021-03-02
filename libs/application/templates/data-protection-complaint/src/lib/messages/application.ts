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
  info: {
    id: 'dpac.application:section.info',
    defaultMessage: 'Upplýsingar',
    description: 'User Info',
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
