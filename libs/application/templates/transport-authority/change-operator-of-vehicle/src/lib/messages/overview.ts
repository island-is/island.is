import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    title: {
      id: 'ta.cov.application:overview.general.title',
      defaultMessage: 'Yfirlit skráningar umráðamanns',
      description: 'Title of overview screen',
    },
    description: {
      id: 'ta.cov.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
  }),
  labels: defineMessages({
    ownersCoOwner: {
      id: 'ta.cov.application:overview.labels.ownersCoOwner',
      defaultMessage: 'Meðeigandi',
      description: 'Owners co owner label',
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'ta.cov.application:overview.confirmationModal.title',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'ta.cov.application:overview.confirmationModal.text',
      defaultMessage: 'Þú ert að fara að hafna tilkynningu.',
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'ta.cov.application:overview.confirmationModal.buttonText',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'ta.cov.application:overview.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
