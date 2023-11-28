import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    title: {
      id: 'aosh.application:overview.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
      description: 'Title of overview screen',
    },
    description: {
      id: 'aosh.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
  }),
  labels: defineMessages({
    addBuyerOperatorButton: {
      id: 'aosh.application:overview.labels.addBuyerOperatorButton',
      defaultMessage: 'Bæta við umráðamanni',
      description: 'Add operator button',
    },
    locationTitle: {
      id: 'aosh.application:overview.labels.locationTitle',
      defaultMessage: 'Ný staðsetning tækis',
      description: 'Location title',
    },
    noLocation: {
      id: 'aosh.application:overview.labels.noLocation',
      defaultMessage: 'Ekkert skráð',
      description: 'User has not chosen a location',
    },
    addLocationButton: {
      id: 'aosh.application:overview.labels.addLocation',
      defaultMessage: 'Skrá staðsetningu tækis',
      description: 'Add location button',
    },
    agreementDate: {
      id: 'aosh.application:overview.labels.agreementDate',
      defaultMessage: 'Dagsetning samnings:',
      description: 'Agreement date label',
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'aosh.application:overview.confirmationModal.title',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'aosh.application:overview.confirmationModal.text',
      defaultMessage: 'Þú ert að fara að hafna tilkynningu.',
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'aosh.application:overview.confirmationModal.buttonText',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'aosh.application:overview.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
