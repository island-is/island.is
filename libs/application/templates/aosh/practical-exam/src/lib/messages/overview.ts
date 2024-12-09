import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.pe.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    description: {
      id: 'aosh.pe.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview page',
    },
    pageTitle: {
      id: 'aosh.pe.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    approveButton: {
      id: 'aosh.pe.application:overview.general.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Overview approveButton label',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.pe.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
    personalInfo: {
      id: 'aosh.pe.application:overview.labels.personalInfo',
      defaultMessage: 'Persónuupplýsingar (skráningaraðili)',
      description: 'Personal info label',
    },
    paymentArrangement: {
      id: 'aosh.pe.application:overview.labels.paymentArrangement',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Payment arrangement label',
    },
    examinee: {
      id: 'aosh.pe.application:overview.labels.examinee',
      defaultMessage: 'Próftakar',
      description: 'Examinee label',
    },
    seeMoreButton: {
      id: 'aosh.pe.application:overview.labels.seeMoreButton',
      defaultMessage: 'Sjá fleiri',
      description: 'See more button label',
    },
    seeLessButton: {
      id: 'aosh.pe.application:overview.labels.seeLessButton',
      defaultMessage: 'Sjá færri',
      description: 'See less button label',
    },
  }),
  table: defineMessages({
    examinee: {
      id: 'aosh.pe.application:overview.table.examinee',
      defaultMessage: 'Próftaki',
      description: 'Examinee table label',
    },
    examineeNationalId: {
      id: 'aosh.pe.application:overview.table.examineeNationalId',
      defaultMessage: 'Próftaki kennitala',
      description: 'Examinee national id table label',
    },
    examCategory: {
      id: 'aosh.pe.application:overview.table.examCategory',
      defaultMessage: 'Prófflokkur',
      description: 'Exam category table label',
    },
    instructor: {
      id: 'aosh.pe.application:overview.table.instructor',
      defaultMessage: 'Leiðbeinandi',
      description: 'Instructor table label',
    },
  }),
}
