import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared across the Parental Leave application templates
  shared: defineMessages({
    applicationName: {
      id: 'vrc.application:application.name',
      defaultMessage: 'Skilavottorð',
      description: 'Application for vehicle rescycle certification',
    },
    institution: {
      id: 'vrc.application:institution.name',
      defaultMessage: 'Úrvinnslusjóður',
      description: 'Icelandic Recycling Fund',
    },
  }),
}
