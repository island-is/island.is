import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    title: {
      id: 'aosh.cms.application:review.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
      description: 'Title of overview screen',
    },
    description: {
      id: 'aosh.cms.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
  }),
  tags: defineMessages({
    text: {
      id: 'aosh.cms.application:review.tags.text',
      defaultMessage: 'Í bið',
      description: 'waiting tag',
    },
  }),
}
