import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const carRecyclingMessages: MessageDir = {
  // Messages shared across the Car Recycling application templates
  shared: defineMessages({
    applicationName: {
      id: 'rf.cr.application:application.name',
      defaultMessage: 'Skilavottorð',
      description: 'Application for car recycle',
    },
    institution: {
      id: 'rf.cr.application:institution.name',
      defaultMessage: 'Úrvinnslusjóður',
      description: 'Icelandic Recycling Fund',
    },
    formTitle: {
      id: 'rf.cr.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
  }),
  pre: defineMessages({
    prerequisitesSection: {
      id: 'rf.cr.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
  }),
}
