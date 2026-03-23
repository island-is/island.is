import { defineMessages } from 'react-intl'

export const contactMessages = defineMessages({
  title: {
    id: 'ronp.application:contact.title',
    defaultMessage: 'Tengiliður',
    description: 'Contact information title',
  },
  description: {
    id: 'ronp.application:contact.description',
    defaultMessage: 'Vinsamlegast gefið upplýsingar um tengilið ef við á.',
    description: 'Contact information description',
  },
  checkboxLabel: {
    id: 'ronp.application:contact.checkboxLabel',
    defaultMessage: 'Tengiliður er sami og umsækjandi',
    description: 'Contact information checkbox label',
  },
  name: {
    id: 'ronp.application:contact.name',
    defaultMessage: 'Nafn tengiliðs',
    description: 'Contact name',
  },
  email: {
    id: 'ronp.application:contact.email',
    defaultMessage: 'Netfang tengiliðs',
    description: 'Contact email',
  },
  phone: {
    id: 'ronp.application:contact.phone',
    defaultMessage: 'Símanúmer tengiliðs',
    description: 'Contact phone',
  },
})
