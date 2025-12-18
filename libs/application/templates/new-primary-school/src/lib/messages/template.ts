import { defineMessages } from 'react-intl'

export const statesMessages = defineMessages({
  applicationReceivedTag: {
    id: 'nps.application:statesMessages.applicationReceivedTag',
    defaultMessage: 'Móttekin',
    description: 'Received',
  },
})

export const pendingActionMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'nps.application:pendingAction.applicationApprovedDescription',
    defaultMessage: 'Umsókn í grunnskóla samþykkt',
    description: 'The application for primary school has been approved',
  },
  applicationRejectedDescription: {
    id: 'nps.application:pendingAction.applicationRejectedDescription',
    defaultMessage: 'Umsókn í grunnskóla hefur verið hafnað',
    description: 'The application for primary school has been rejected',
  },
  otherGuardianApprovalAssigneeDescription: {
    id: 'nps.application:pendingAction.otherGuardianApprovalAssigneeDescription',
    defaultMessage:
      'Óskað hefur verið eftir undirritun þinni vegna umsóknar fyrir barnið þitt í skóla.',
    description:
      'Your signature has been requested on an application for your child’s enrolment in school.',
  },
  otherGuardianApprovalApplicantDescription: {
    id: 'nps.application:pendingAction.otherGuardianApprovalApplicantDescription',
    defaultMessage: 'Umsókn þín er í bið eftir samþykki frá forsjáraðila.',
    description: 'Your application is pending approval from guardian.',
  },
  otherGuardianRejectedTitle: {
    id: 'nps.application:pendingAction.otherGuardianRejectedTitle',
    defaultMessage: 'Forsjáraðili hefur hafnað umsókn',
    description: 'The guardian has rejected the application',
  },
  otherGuardianRejectedDescription: {
    id: 'nps.application:pendingAction.otherGuardianRejectedDescription',
    defaultMessage:
      'Forsjáraðili hefur hafnað umsókn, vinsamlegast gerðu breytingar á umsókn.',
    description:
      'The application has been rejected by a guardian, please make changes to the application.',
  },
  payerApprovalAssigneeDescription: {
    id: 'nps.application:pendingAction.payerApprovalAssigneeDescription',
    defaultMessage:
      'Þú hefur verið skráð/ur sem greiðandi fyrir skólavist barns.',
    description:
      'You have been registered as the payer for a child’s school fees.',
  },
  payerApprovalApplicantDescription: {
    id: 'nps.application:pendingAction.payerApprovalApplicantDescription',
    defaultMessage: 'Umsókn þín er í bið eftir samþykki frá skráðum greiðanda.',
    description:
      'Your application is pending approval from the registered payer.',
  },
  payerRejectedTitle: {
    id: 'nps.application:pendingAction.payerRejectedTitle',
    defaultMessage: 'Skráður greiðandi hefur hafnað umsókn',
    description: 'The registered payer has rejected the application',
  },
  payerRejectedDescription: {
    id: 'nps.application:pendingAction.payerRejectedDescription',
    defaultMessage:
      'Skráður greiðandi hefur hafnað umsókn, vinsamlegast gerðu breytingar á umsókn.',
    description:
      'The registered payer has rejected the application, please make changes to the application.',
  },
})

export const historyMessages = defineMessages({
  otherGuardianApprovalApproved: {
    id: 'nps.application:history.otherGuardianApprovalApproved',
    defaultMessage: 'Forsjáraðili samþykkti umsókn',
    description: 'The guardian approved the application',
  },
  otherGuardianApprovalRejected: {
    id: 'nps.application:history.otherGuardianApprovalRejected',
    defaultMessage: 'Forsjáraðili hafnaði umsókn',
    description: 'The guardian rejected the application',
  },
  payerApprovalApproved: {
    id: 'nps.application:history.payerApprovalApproved',
    defaultMessage: 'Skráður greiðandi samþykkti umsókn',
    description: 'The registered payer approved the application',
  },
  payerApprovalRejected: {
    id: 'nps.application:history.payerApprovalRejected',
    defaultMessage: 'Skráður greiðandi hafnaði umsókn',
    description: 'The registered payer rejected the application',
  },
  applicationEdited: {
    id: 'nps.application:history.applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
})
