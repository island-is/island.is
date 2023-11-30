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
      defaultMessage: 'Yfirlit umsóknar um háskólanám',
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
      defaultMessage: 'Breyta',
      description: 'change button label',
    },
    applicant: {
      id: 'uni.application:review.labels.applicant#markdown',
      defaultMessage: '**Umsækjandi**',
      description: 'Applicant review label',
    },
  }),
}
