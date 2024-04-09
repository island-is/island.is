import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'uni.application:name',
    defaultMessage: 'Háskólanám',
    description: `Application's name`,
  },
  institutionName: {
    id: 'uni.application:institution',
    defaultMessage: 'Háskóla-, iðnaðar- og nýsköpunarráðuneytið',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'uni.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'uni.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'uni.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'uni.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  actionCardWaitingForSchool: {
    id: 'uni.application:actionCardWaitingForSchool',
    defaultMessage: 'Í vinnslu hjá skóla',
    description:
      'Description of application state/status when the application is in progress at the university',
  },
  historyApprovedBySchool: {
    id: 'uni.application:historyApprovedBySchool',
    defaultMessage: 'Samþykkt af skóla',
    description: 'Description of acceptance by school',
  },
  submit: {
    id: 'uni.application:submit',
    defaultMessage: 'Senda umsókn',
    description: 'submit button label',
  },
  pendingActionSchool: {
    id: 'uni.application:pendingActionSchool',
    defaultMessage: 'Háskólinn fer nú yfir umsóknina þína',
    description: 'pending action from school label',
  },
  pendingActionStudent: {
    id: 'uni.application:pendingActionStudent',
    defaultMessage: 'Vinsamlegast staðfestu skólavist',
    description: 'pending action from student label',
  },
})
