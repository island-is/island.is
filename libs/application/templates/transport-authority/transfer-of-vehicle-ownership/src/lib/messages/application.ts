import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.tvo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti að ökutæki {value}',
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
    id: 'ta.tvo.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'ta.tvo.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'ta.tvo.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogSentApplication: {
    id: 'ta.tvo.application:historyLogSentApplication',
    defaultMessage: 'Umsókn send á Samgöngustofu',
    description: 'History log application sent',
  },
  historyLogApprovedByBuyer: {
    id: 'ta.tvo.application:historyLogApprovedByBuyer',
    defaultMessage: 'Samþykkt af kaupanda',
    description: 'History log when application is approved by buyer',
  },
  historyLogApprovedByBuyerCoOwner: {
    id: 'ta.tvo.application:historyLogApprovedByBuyerCoOwner',
    defaultMessage: 'Samþykkt af meðeiganda kaupanda',
    description: 'History log when application is approved by buyer co-owner',
  },
  historyLogApprovedByBuyerOperator: {
    id: 'ta.tvo.application:historyLogApprovedByBuyerOperator',
    defaultMessage: 'Samþykkt af umráðamanni kaupanda',
    description: 'History log when application is approved by buyer operator',
  },
  historyLogApprovedBySellerCoOwner: {
    id: 'ta.tvo.application:historyLogApprovedBySellerCoOwner',
    defaultMessage: 'Samþykkt af meðeiganda seljanda',
    description: 'History log when application is approved by seller co-owner',
  },
  historyLogRejectedByBuyer: {
    id: 'ta.tvo.application:historyLogRejectedByBuyer',
    defaultMessage: 'Hafnað af kaupanda',
    description: 'History log when application is rejected by buyer',
  },
  historyLogRejectedByBuyerCoOwner: {
    id: 'ta.tvo.application:historyLogRejectedByBuyerCoOwner',
    defaultMessage: 'Hafnað af meðeiganda kaupanda',
    description: 'History log when application is rejected by buyer co-owner',
  },
  historyLogRejectedByBuyerOperator: {
    id: 'ta.tvo.application:historyLogRejectedByBuyerOperator',
    defaultMessage: 'Hafnað af umráðamanni kaupanda',
    description: 'History log when application is rejected by buyer operator',
  },
  historyLogRejectedBySellerCoOwner: {
    id: 'ta.tvo.application:historyLogRejectedBySellerCoOwner',
    defaultMessage: 'Hafnað af meðeiganda seljanda',
    description: 'History log when application is rejected by seller co-owner',
  },
})
