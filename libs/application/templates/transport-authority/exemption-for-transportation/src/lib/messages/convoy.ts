import { defineMessages } from 'react-intl'

export const convoy = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:convoy.general.sectionTitle',
      defaultMessage: 'Vagnlest',
      description: 'Title of convoy section',
    },
    pageTitle: {
      id: 'ta.eft.application:convoy.general.pageTitle',
      defaultMessage: 'Veldu ökutæki sem á að nota við flutninginn',
      description: 'Title of convoy page',
    },
    description: {
      id: 'ta.eft.application:convoy.general.description',
      defaultMessage:
        'Hér að neðan skaltu velja þau ökutæki sem verða notuð við flutning.  Hægt er að velja eitt ökutæki eða eitt ökutæki og einn eftirvagn.',
      description: 'Description of convoy page',
    },
  }),
  labels: defineMessages({
    vehicle: {
      id: 'ta.eft.application:convoy.labels.vehicle',
      defaultMessage: 'Fastanúmer ökutækis',
      description: 'Vehicle permno label',
    },
    trailer: {
      id: 'ta.eft.application:convoy.labels.trailer',
      defaultMessage: 'Fastanúmer eftirvagns',
      description: 'Trailer permno label',
    },
  }),
}
