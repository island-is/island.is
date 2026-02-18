import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit og staðfesting',
      description: 'Overview section title',
    },
    title: {
      id: 'gfl.application:overview.general.name',
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview title',
    },
    description: {
      id: 'gfl.application:overview.general.description',
      defaultMessage: 'Farðu vel yfir efnið áður en þú sendir inn umsóknina.',
      description: 'Overview description',
    },
    attachment1: {
      id: 'gfl.application:overview.general.attachment1',
      defaultMessage: 'Viðhengi 1',
      description: 'Overview attachments label for attachment 1',
    },
    attachment2: {
      id: 'gfl.application:overview.general.attachment2',
      defaultMessage: 'Viðhengi 2',
      description: 'Overview attachments label for attachment 2',
    },
  }),
  labels: defineMessages({
    amount: {
      id: 'gfl.application:overview.labels.amount',
      defaultMessage: 'Upphæð',
      description: 'Overview amount label',
    },
    submit: {
      id: 'gfl.application:overview.labels.submit',
      defaultMessage: 'Staðfesta og greiða',
      description: 'Overview approve button label',
    },
  }),
}
