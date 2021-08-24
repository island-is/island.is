import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit tilkynningar slyss',
      description: 'Overview of accident report',
    },
    description: {
      id: 'an.application:overview.general.description',
      defaultMessage:
        'Á þessari síðu má sjá upplýsingar um þann slasaða og nákvæma lýsingu á slysi, farðu vel yfir áður en þú sendir inn tilkynninguna.',
      description:
        'On this page you can see information about the injured and a detailed description of the accident, go over it carefully before submitting the report.',
    },
  }),
  labels: defineMessages({
    accidentType: {
      id: 'an.application:overview.labels.accidentType',
      defaultMessage: 'Slysaflokkur',
      description: 'Type of accident',
    },
    attachments: {
      id: 'an.application:overview.labels.attachments',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    submit: {
      id: 'an.application:overview.labels.submit',
      defaultMessage: 'Staðfesta',
      description: 'Submit button text',
    },
    workMachine: {
      id: 'an.application:overview.labels.workMachine',
      defaultMessage: 'Upplýsingar um vinnuvél sem tengist slysi',
      description: 'Label for work machine section in overview',
    },
  }),
}
