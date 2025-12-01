import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.ccov.application:name',
    defaultMessage: 'Bæta við meðeiganda á ökutæki {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.ccov.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.ccov.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.ccov.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'ta.ccov.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'ta.ccov.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByOldCoOwner: {
    id: 'ta.ccov.application:historyLogApprovedByOldCoOwner',
    defaultMessage: 'Samþykkt af fyrrverandi meðeiganda',
    description: 'History log when application is approved by old co-owner',
  },
  historyLogApprovedByNewCoOwner: {
    id: 'ta.ccov.application:historyLogApprovedByNewCoOwner',
    defaultMessage: 'Samþykkt af nýjum meðeiganda',
    description: 'History log when application is approved by new co-owner',
  },
  historyLogRejectedByOldCoOwner: {
    id: 'ta.ccov.application:historyLogRejectedByOldCoOwner',
    defaultMessage: 'Hafnað af fyrrverandi meðeiganda',
    description: 'History log when application is rejected by old co-owner',
  },
  historyLogRejectedByNewCoOwner: {
    id: 'ta.ccov.application:historyLogRejectedByNewCoOwner',
    defaultMessage: 'Hafnað af nýjum meðeiganda',
    description: 'History log when application is rejected by new co-owner',
  },
})
