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
  actionCardWaitingForSchool: {
    id: 'id.application:actionCardWaitingForSchool',
    defaultMessage: 'Í vinnslu hjá skóla',
    description:
      'Description of application state/status when the application is in progress at the university',
  },
  historyApprovedBySchool: {
    id: 'id.application:historyApprovedBySchool',
    defaultMessage: 'Samþykkt af skóla',
    description: 'Description of acceptance by school',
  },
  submit: {
    id: 'id.application:submit',
    defaultMessage: 'Senda umsókn',
    description: 'submit button label',
  },
  pendingActionSchool: {
    id: 'id.application:pendingActionSchool',
    defaultMessage: 'Háskólinn fer nú yfir umsóknina þína',
    description: 'pending action from school label',
  },
  pendingActionStudent: {
    id: 'id.application:pendingActionStudent',
    defaultMessage: 'Vinsamlegast staðfestu skólavist',
    description: 'pending action from student label',
  },
  historyWaitingForParentB: {
    id: 'id.application:historyWaitingForParentB',
    defaultMessage: 'Beðið eftir samþykki forráðamanns',
    description: 'History waiting for parentB',
  },
})
