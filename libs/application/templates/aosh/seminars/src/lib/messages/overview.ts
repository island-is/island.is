import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.sem.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    description: {
      id: 'aosh.sem.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview page',
    },
    pageTitle: {
      id: 'aosh.sem.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    approveButton: {
      id: 'aosh.sem.application:overview.general.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Overview approveButton label',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.sem.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
    seminar: {
      id: 'aosh.sem.application:overview.labels.seminar',
      defaultMessage: 'Námskeið',
      description: 'Seminar label',
    },
    personalInfo: {
      id: 'aosh.sem.application:overview.labels.personalInfo',
      defaultMessage: 'Skráningaraðili',
      description: 'Personal info label',
    },
    paymentArrangement: {
      id: 'aosh.sem.application:overview.labels.paymentArrangement',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Payment arrangement label',
    },
    participants: {
      id: 'aosh.sem.application:overview.labels.participants',
      defaultMessage: 'Þátttakendur',
      description: 'Participants label',
    },
  }),
  seminarInfo: defineMessages({
    seminarBegins: {
      id: 'aosh.sem.application:overview.seminarInfo.seminarBegins',
      defaultMessage: 'Hefst við skráningu',
      description: 'Overview seminarInfo seminarBegins label',
    },
    seminarEnds: {
      id: 'aosh.sem.application:overview.seminarInfo.seminarEnds',
      defaultMessage: 'Er opið í 8 vikur frá skráningu',
      description: 'Overview seminarInfo seminarEnds label',
    },
  }),
  personalInfo: defineMessages({
    name: {
      id: 'aosh.sem.application:overview.personalInfo.name',
      defaultMessage: 'Nafn: {value}',
      description: 'Overview personalInfo name label',
    },
    nationalId: {
      id: 'aosh.sem.application:overview.personalInfo.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: 'Overview personalInfo nationalId label',
    },
  }),
  paymentArrangement: defineMessages({
    cashOnDelivery: {
      id: 'aosh.sem.application:overview.paymentArrangement.cashOnDelivery',
      defaultMessage: 'Staðgreiðsla',
      description: 'Overview paymentArrangement cashOnDelivery label',
    },
    putIntoAccount: {
      id: 'aosh.sem.application:overview.paymentArrangement.putIntoAccount',
      defaultMessage: 'Setja í reikning',
      description: 'Overview paymentArrangement putIntoAccount label',
    },
    payer: {
      id: 'aosh.sem.application:overview.paymentArrangement.payer',
      defaultMessage: 'Greiðandi: {value}',
      description: 'Overview paymentArrangement payer label',
    },
    contactEmail: {
      id: 'aosh.sem.application:overview.paymentArrangement.contactEmail',
      defaultMessage: 'Netfang tengiliðs: {value}',
      description: 'Overview paymentArrangement contactEmail label',
    },
    contactPhone: {
      id: 'aosh.sem.application:overview.paymentArrangement.contactPhone',
      defaultMessage: 'Símanúmer tengiliðs: {value}',
      description: 'Overview paymentArrangement contactPhone label',
    },
    explanation: {
      id: 'aosh.sem.application:overview.paymentArrangement.explanation',
      defaultMessage: 'Skýring: {value}',
      description: 'Overview paymentArrangement explanation label',
    },
    email: {
      id: 'aosh.sem.application:overview.paymentArrangement.email',
      defaultMessage: 'Netfang: {value}',
      description: 'Overview paymentArrangement email label',
    },
    phonenumber: {
      id: 'aosh.sem.application:overview.paymentArrangement.phonenumber',
      defaultMessage: 'Símanúmer: {value}',
      description: 'Overview paymentArrangement phonenumber label',
    },
    nationalId: {
      id: 'aosh.sem.application:overview.paymentArrangement.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: 'Overview paymentArrangement nationalId label',
    },
  }),
}
