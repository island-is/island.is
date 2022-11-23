import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    title: {
      id: 'ta.tvo.application:review.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
      description: 'Title of overview screen',
    },
    sectionTitle: {
      id: 'ta.tvo.application:review.general.sectionTitle',
      defaultMessage: 'Til samþykktar',
      description: 'Title of overview screen',
    },
    description: {
      id: 'ta.tvo.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
    approvedSectionTitle: {
      id: 'ta.tvo.application:review.general.approvedSectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Approved section title of overview screen',
    },
  }),
  buttons: defineMessages({
    back: {
      id: 'ta.tvo.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'ta.tvo.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'ta.tvo.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
}
