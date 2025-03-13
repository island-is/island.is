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
}
