import { defineMessages } from 'react-intl'

export const assigneeMessages = {
  shared: defineMessages({
    childName: {
      id: 'nps.application:assignee.shared.childName',
      defaultMessage: 'Nafn barns',
      description: 'Child’s name',
    },
    approve: {
      id: 'nps.application:assignee.shared.approve',
      defaultMessage: 'Samþykkja',
      description: 'Approve',
    },
    reject: {
      id: 'nps.application:assignee.shared.reject',
      defaultMessage: 'Hafna',
      description: 'Reject',
    },
    thanksDescription: {
      id: 'nps.application:assignee.shared.thanksDescription',
      defaultMessage: 'Takk fyrir! Afstaða þín er skráð.',
      description: 'Thank you! Your position has been registered.',
    },
    editApplication: {
      id: 'nps.application:assignee.shared.editApplication',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
  }),
  otherGuardian: defineMessages({
    title: {
      id: 'nps.application:assignee.otherGuardian.title',
      defaultMessage: 'Undirritun beggja forsjáraðila',
      description: 'Signature of both guardians',
    },
    approvalDescription: {
      id: 'nps.application:assignee.otherGuardian.approvalDescription',
      defaultMessage:
        'Óskað hefur verið eftir undirritun þinni vegna umsóknar fyrir barnið þitt í eftirfarandi skóla',
      description:
        'Your signature has been requested on an application for your child’s enrolment in the following school',
    },
    rejectedDescription: {
      id: 'nps.application:assignee.otherGuardian.rejectedDescription',
      defaultMessage:
        'Forsjáraðili hefur hafnað því að undirrita umsókn fyrir barnið ykkar í eftirfarandi skóla',
      description:
        'The guardian has refused to sign your child’s application for the following school',
    },
    name: {
      id: 'nps.application:assignee.otherGuardian.name',
      defaultMessage: 'Nafn forsjáraðila',
      description: 'Name of guardian',
    },
    alertMessage: {
      id: 'nps.application:assignee.otherGuardian.alertMessage',
      defaultMessage:
        'Ekki er hægt að senda inn umsókn nema að undirritun beggja forsjáraðila liggi fyrir.',
      description:
        'Unable to submit application without the signatures of both guardians',
    },
  }),
  payer: defineMessages({
    title: {
      id: 'nps.application:assignee.payer.title',
      defaultMessage: 'Greiðandi gjalds fyrir skólavist',
      description: 'Payer of school fees',
    },
    approvalDescription: {
      id: 'nps.application:assignee.payer.approvalDescription',
      defaultMessage:
        'Þú hefur verið skráð/ur sem greiðandi gjalds fyrir skólavist barns í sjálfstætt starfandi skóla.',
      description:
        'You have been registered as the payer of schools fees for a child’s enrolment in an independent school.',
    },
    rejectedDescription: {
      id: 'nps.application:assignee.payer.rejectedDescription',
      defaultMessage:
        'Umbeðinn greiðandi hefur hafnað beiðni þinni um greiðslu skólagjalda.',
      description:
        'The requested payer has rejected your request for the payment of school fees',
    },
    name: {
      id: 'nps.application:assignee.payer.name',
      defaultMessage: 'Nafn greiðanda',
      description: 'Payer name',
    },
    alertMessage: {
      id: 'nps.application:assignee.payer.alertMessage',
      defaultMessage:
        'Vinsamlegast farðu inn í umsóknina og veldu annan greiðanda',
      description: 'Please revisit the application and choose another payer',
    },
  }),
}
