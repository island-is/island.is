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
    agreementCheckbox: {
      id: 'aosh.pe.application:overview.labels.agreementCheckbox#markdown',
      defaultMessage:
        'Ég hef kynnt mér [greiðslu- og viðskiptaskilmála](https://island.is/s/vinnueftirlitid/gjaldskra#greidslu-og-vidskiptaskilmalar) Vinnueftirlitsins',
      description: 'Agreement checkbox label on conclusion screen',
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
  registrant: defineMessages({
    name: {
      id: 'aosh.pe.application:overview.registrant.name',
      defaultMessage: 'Nafn: {value}',
      description: 'Overview registrant name field',
    },
    title: {
      id: 'aosh.pe.application:overview.registrant.title',
      defaultMessage: 'Skráningaraðili',
      description: 'Overview registrant title',
    },
    nationalId: {
      id: 'aosh.pe.application:overview.registrant.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: 'Overview registrant nationalId field',
    },
    phone: {
      id: 'aosh.pe.application:overview.registrant.phone',
      defaultMessage: 'Símanúmer: {value}',
      description: 'Overview registrant phone field',
    },
    email: {
      id: 'aosh.pe.application:overview.registrant.email',
      defaultMessage: 'Netfang: {value}',
      description: 'Overview registrant email field',
    },
  }),
  payment: defineMessages({
    title: {
      id: 'aosh.pe.application:overview.payment.title',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Overview payment title',
    },
    cashOnDelivery: {
      id: 'aosh.pe.application:overview.payment.cashOnDelivery',
      defaultMessage: 'Staðgreiðsla',
      description: 'Overview cash payment',
    },
    invoice: {
      id: 'aosh.pe.application:overview.payment.invoice',
      defaultMessage: 'Í reikning',
      description: 'Overview invoice payment',
    },
    explanation: {
      id: 'aosh.pe.application:overview.payment.explanation',
      defaultMessage: 'Skýring: {value}',
      description: 'Overview explanation',
    },
  }),
  exam: defineMessages({
    title: {
      id: 'aosh.pe.application:overview.exam.title',
      defaultMessage: 'Prófupplýsingar',
      description: 'Overview exam info title',
    },
  }),
  examLocation: defineMessages({
    title: {
      id: 'aosh.pe.application:overview.examLocation.title',
      defaultMessage: 'Prófstaður',
      description: 'Overview exam location title',
    },
    location: {
      id: 'aosh.pe.application:overview.examLocation.location',
      defaultMessage: '{address}, {postalCode}',
      description: 'Overview exam location',
    },
    email: {
      id: 'aosh.pe.application:overview.examLocation.email',
      defaultMessage: 'Netfang tengiliðs: {value}',
      description: 'Overview exam location email',
    },
    phone: {
      id: 'aosh.pe.application:overview.examLocation.phone',
      defaultMessage: 'Símanúmer tengiliðs: {value}',
      description: 'Overview exam location phone',
    },
  }),
  examInfoSelf: defineMessages({
    examinee: {
      id: 'aosh.pe.application:overview.examInfoSelf.examinee',
      defaultMessage: 'Próftaki: {value}',
      description: 'Overview exam info for self path, name of examinee label',
    },
    categories: {
      id: 'aosh.pe.application:overview.examInfoSelf.categories',
      defaultMessage: 'Prófflokkar: {value}',
      description: 'Overview exam info for self path, exam categories label',
    },
    instructor: {
      id: 'aosh.pe.application:overview.examInfoSelf.instructor',
      defaultMessage: 'Leiðbeinandi: {category}-flokks: {instructor}',
      description: 'Overview exam info for self path, instructor label',
    },
  }),
}
