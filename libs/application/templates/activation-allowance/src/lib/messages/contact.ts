import { defineMessages } from 'react-intl'

export const contact = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:contact.general.sectionTitle',
      defaultMessage: 'Tengiliður',
      description: 'contact section title',
    },
    pageTitle: {
      id: 'aa.application:contact.general.pageTitle',
      defaultMessage: 'Tengiliður',
      description: `contact page title`,
    },
    description: {
      id: 'aa.application:contact.general.description',
      defaultMessage:
        'Vinsamlegast gefið upp tengiliðaupplýsingar ef það á við.',
      description: `contact description`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'aa.application:contact.labels.name',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Contact name',
    },
    connection: {
      id: 'aa.application:contact.labels.connection',
      defaultMessage: 'Tengsl við umsækjanda',
      description: 'Contact connection to user',
    },
    email: {
      id: 'aa.application:contact.labels.email',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email',
    },
    phone: {
      id: 'aa.application:contact.labels.phone',
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Contant phone',
    },
    contactSameAsUser: {
      id: 'aa.application:contact.labels.contactSameAsUser',
      defaultMessage: 'Tengiliður er sá sami og umsækjandi',
      description: 'Contant phone',
    },
  }),
}
