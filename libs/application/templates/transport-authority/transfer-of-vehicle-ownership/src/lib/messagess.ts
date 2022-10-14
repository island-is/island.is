import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'ta.tvo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti að ökutæki',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.tvo.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.tvo.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'cr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.tvo.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  confirmation: {
    id: 'ta.tvo.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'cr.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  openMySites: {
    id: 'ta.tvo.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  successTitle: {
    id: 'ta.tvo.application:successTitle',
    defaultMessage:
      'Tilkynning þín um eigendaskipti að ökutæki hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'ta.tvo.application:successDescription',
    defaultMessage: ' ',
    description: '',
  },
})
