import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const paymentPlanFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'pp.application:applicationTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Payment Plan',
    },
  }),

  pre: defineMessages({
    registryIcelandDescription: {
      id: 'pp.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
  }),

  info: defineMessages({
    section: {
      id: 'pp.application:section',
      defaultMessage: 'Tekjuáætlun',
      description: 'Payment Plan',
    },
    instructionsTitle: {
      id: 'pp.application:instructions.title',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
      description: 'Instructions on filling out your payment plan',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'pp.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'pp.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'pp.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'pp.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
  }),
}