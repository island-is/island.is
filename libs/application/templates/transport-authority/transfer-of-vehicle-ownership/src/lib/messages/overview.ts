import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    title: {
      id: 'ta.tvo.application:overview.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
      description: 'Title of overview screen',
    },
    description: {
      id: 'ta.tvo.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
  }),
  labels: defineMessages({
    sellersCoOwner: {
      id: 'ta.tvo.application:overview.labels.sellersCoOwner',
      defaultMessage: 'Meðeigandi seljanda',
      description: 'Sellers co owner label',
    },
    addCoOwnerAndOperatorButton: {
      id: 'ta.tvo.application:overview.labels.addCoOwnerAndOperatorButton',
      defaultMessage: 'Bæta við meðeiganda/umráðamanni',
      description: 'Add co owner and operator button',
    },
  }),
}
