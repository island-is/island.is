import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const disabilityPensionFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'ol.application:application.title',
      defaultMessage: 'Umsókn um örorkulífeyri',
      description: 'Application for disability pension',
    },
  })
}
