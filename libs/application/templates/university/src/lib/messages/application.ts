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

  // TODO(ballioli) These are part of organization access prototype
  actionCardInSchoolReview: {
    id: 'uni.application:actionCardInSchoolReview',
    defaultMessage: 'Í vinnslu hjá skóla',
    description:
      'Description of application state/status when the application is in review at school',
  },
  actionCardSchoolAccepted: {
    id: 'uni.application:actionCardSchoolAccepted',
    defaultMessage: 'Samþykkt frá skóla',
    description:
      'Description of application state/status when the application has been accepted by school',
  },
  actionCardStudentRejected: {
    id: 'uni.application:actionCardStudentRejected',
    defaultMessage: 'Hafnað af umsækjanda',
    description:
      'Description of application state/status when the application has been rejected by user',
  },
  actionCardSchoolRejected: {
    id: 'uni.application:actionCardSchoolAccepted',
    defaultMessage: 'Hafnað af skóla',
    description:
      'Description of application state/status when the application has been rejected by school',
  },
  actionCardSchoolAcceptedHistory: {
    id: 'uni.application:actionCardSchoolAcceptedHistory',
    defaultMessage: 'Umsókn samþykkt',
    description:
      'Description of application history message when the application has been accepted by school',
  },
  actionCardSchoolRejectedHistory: {
    id: 'uni.application:actionCardSchoolRejectedHistory',
    defaultMessage: 'Umsókn hafnað af skóla',
    description:
      'Description of application history message when the application has been rejected by school',
  },
  pendingActionContentSchool: {
    id: 'uni.application:pendingActionContentSchool',
    defaultMessage: 'Skóli fer núna yfir umsóknina þína',
    description: 'pending action from school label (content)',
  },
  pendingActionSchoolRejected: {
    id: 'uni.application:pendingActionSchoolRejected',
    defaultMessage: 'Háskólinn hefur hafnað umsókn',
    description: 'pending action from school rejected (content)',
  },
  pendingActionSchoolTitleRejected: {
    id: 'uni.application:pendingActionSchoolTitleRejected',
    defaultMessage: 'Háskólinn hafnaði umsókn',
    description: 'pending action from school title',
  },
  pendingActionPendingStudentAnswerContent: {
    id: 'uni.application:pendingActionPendingStudentAnswerContent',
    defaultMessage: 'Vinsamlegast staðfestu skólavist',
    description: 'pending action, applicant please confirm',
  },
  pendingActionSchoolAcceptedHistory: {
    id: 'uni.application:pendingActionSchoolAcceptedHistory',
    defaultMessage: 'Umsókn samþykkt',
    description:
      'Description of pending action message when the application has been accepted by school',
  },
})
