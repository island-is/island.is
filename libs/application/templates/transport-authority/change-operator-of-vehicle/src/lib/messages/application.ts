import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.cov.application:name',
    defaultMessage: 'Bæta við umráðamanni á ökutæki {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.cov.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.cov.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.cov.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'ta.cov.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'ta.cov.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByCoOwner: {
    id: 'ta.cov.application:historyLogApprovedByCoOwner',
    defaultMessage: 'Samþykkt af meðeiganda',
    description: 'History log when application is approved by co-owner',
  },
  historyLogApprovedByNewOperator: {
    id: 'ta.cov.application:historyLogApprovedByNewOperator',
    defaultMessage: 'Samþykkt af nýjum umráðamanni',
    description: 'History log when application is approved by new operator',
  },
  historyLogRejectedByCoOwner: {
    id: 'ta.cov.application:historyLogRejectedByCoOwner',
    defaultMessage: 'Hafnað af meðeiganda',
    description: 'History log when application is rejected by co-owner',
  },
  historyLogRejectedByNewOperator: {
    id: 'ta.cov.application:historyLogRejectedByNewOperator',
    defaultMessage: 'Hafnað af nýjum umráðamanni',
    description: 'History log when application is rejected by new operator',
  },
})
