import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'ls.application:application.name',
    defaultMessage: 'Umsókn um innskráningarþjónustu',
    description: 'Name of the Login Service application',
  },
  description: {
    id: 'ls.application:application.description',
    defaultMessage: 'Lýsing á umsókn um innskráningarþjónustu',
    description: 'Description of the Login Service application',
  },
})

// All sections in the application
export const section = defineMessages({
  stepOne: {
    id: 'ls.application:section.stepOne',
    defaultMessage: 'Skref eitt',
    description: 'Skref eitt',
  },
})
