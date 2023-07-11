import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:review.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Review section title',
    },
    pageTitle: {
      id: 'doi.cs.application:review.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar til ríkisborgararétts',
      description: 'Review page title',
    },
    description: {
      id: 'doi.cs.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp',
      description: 'Review description',
    },
  }),
  labels: defineMessages({
    changeButtonText: {
      id: 'doi.cs.application:review.labels.changeButtonText',
      defaultMessage: 'Breyta',
      description: 'change button label',
    },
    applicant: {
      id: 'doi.cs.application:review.labels.applicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant review label',
    },
    children: {
      id: 'doi.cs.application:review.labels.children',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'children review label',
    },
    residencyConditions: {
      id: 'doi.cs.application:review.labels.residencyConditions',
      defaultMessage: 'Búsetuskilyrði',
      description: 'residencyConditions review label',
    },
    parents: {
      id: 'doi.cs.application:review.labels.parents',
      defaultMessage: 'Foreldrar með íslenskt ríkisfang',
      description: 'parents review label',
    },
    maritalStatus: {
      id: 'doi.cs.application:review.labels.maritalStatus',
      defaultMessage: 'Hjúskaparstaða',
      description: 'maritalStatus review label',
    },
    partner: {
      id: 'doi.cs.application:review.labels.partner',
      defaultMessage: 'Maki',
      description: 'partner review label',
    },
    residency: {
      id: 'doi.cs.application:review.labels.residency',
      defaultMessage: 'Búsetulönd',
      description: 'residency review label',
    },
    abroadStays: {
      id: 'doi.cs.application:review.labels.abroadStays',
      defaultMessage: 'Dvöl erlendis',
      description: 'abroadStays review label',
    },
    passports: {
      id: 'doi.cs.application:review.labels.passports',
      defaultMessage: 'Vegabréf {name}',
      description: 'passport review label',
    },
    documents: {
      id: 'doi.cs.application:review.labels.documents',
      defaultMessage: 'Fylgiskjöl {name}',
      description: 'documents review label',
    },
  }),
}
