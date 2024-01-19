import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:review.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Review section title',
    },
    pageTitle: {
      id: 'uni.application:review.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Review page title',
    },
    description: {
      id: 'uni.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp',
      description: 'Review description',
    },
  }),
  labels: defineMessages({
    changeButtonText: {
      id: 'uni.application:review.labels.changeButtonText',
      defaultMessage: 'Breyta upplýsingum',
      description: 'change button label',
    },
    applicant: {
      id: 'uni.application:review.labels.applicant#markdown',
      defaultMessage: '**Umsækjandi**',
      description: 'Applicant review label',
    },
    chosenProgram: {
      id: 'uni.application:review.labels.chosenProgram',
      defaultMessage: 'Valið háskólanám til umsóknar',
      description: 'Chosen program review label',
    },
    schoolCareer: {
      id: 'uni.application:review.labels.schoolCareer',
      defaultMessage: 'Námsferill',
      description: 'School career review label',
    },
    otherDocuments: {
      id: 'uni.application:review.labels.otherDocuments',
      defaultMessage: 'Önnur fylgigögn',
      description: 'Other documents review label',
    },
    phoneLabel: {
      id: 'uni.application:review.labels.phoneLabel',
      defaultMessage: 'Sími',
      description: 'phone label',
    },
  }),
}
