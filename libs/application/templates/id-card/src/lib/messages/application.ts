import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'id.application:name#markdown',
    defaultMessage: 'Umsókn um nafnskírteini {name}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'id.application:institution',
    defaultMessage: 'Þjóðskrá',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'id.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'id.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'id.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'id.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  submit: {
    id: 'id.application:submit',
    defaultMessage: 'Senda umsókn',
    description: 'submit button label',
  },
  historyLogApprovedByParentB: {
    id: 'id.application:historyLogApprovedByParentB',
    defaultMessage: 'Samþykkt af forsjáraðila 2',
    description: 'History log approved by parentB',
  },
})
