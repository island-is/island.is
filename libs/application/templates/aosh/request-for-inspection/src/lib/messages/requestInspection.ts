import { defineMessages } from 'react-intl'

export const supervisor = {
  general: defineMessages({
    title: {
      id: 'aosh.rifm.application:supervisor.general.title',
      defaultMessage: 'Umráðamaður',
      description: 'Title of supervisor screen',
    },
    newSupervisorTitle: {
      id: 'aosh.rifm.application:supervisor.general.newSupervisorTitle',
      defaultMessage: 'Upplýsingar um nýjan umráðamann',
      description: 'Title of supervisor screen',
    },
    description: {
      id: 'aosh.rifm.application:supervisor.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of supervisor screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.rifm.application:supervisor.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    ownerIsSupervisor: {
      id: 'aosh.rifm.application:supervisor.labels.addressLabel',
      defaultMessage: 'Eigandi er umráðamaður',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.rifm.application:supervisor.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.rifm.application:supervisor.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    approveButton: {
      id: 'aosh.rifm.application:supervisor.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Location approve button text',
    },
  }),
}
