import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    title: {
      id: 'ta.cov.application:overview.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
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
    sellersCoOwner: {
      id: 'ta.cov.application:overview.labels.sellersCoOwner',
      defaultMessage: 'Meðeigandi seljanda',
      description: 'Sellers co owner label',
    },
    buyersCoOwner: {
      id: 'ta.cov.application:overview.labels.buyersCoOwner',
      defaultMessage: 'Meðeigandi kaupanda',
      description: 'Buyers co owner label',
    },
    addCoOwnerAndOperatorButton: {
      id: 'ta.cov.application:overview.labels.addCoOwnerAndOperatorButton',
      defaultMessage: 'Bæta við meðeiganda/umráðamanni',
      description: 'Add co owner and operator button',
    },
    insuranceTitle: {
      id: 'ta.cov.application:overview.labels.insuranceTitle',
      defaultMessage: 'Tryggingafélag',
      description: 'Insurance company title',
    },
    noChosenInsurance: {
      id: 'ta.cov.application:overview.labels.noChosenInsurance',
      defaultMessage: 'Ekkert tryggingafélag er valið',
      description: 'User has not chosen an insurance company',
    },
    addInsuranceButton: {
      id: 'ta.cov.application:overview.labels.addInsuranceButton',
      defaultMessage: 'Skrá tryggingafélag',
      description: 'Add insurance company button',
    },
    salePrice: {
      id: 'ta.cov.application:overview.labels.salePrice',
      defaultMessage: 'Söluverð:',
      description: 'Saleprice label',
    },
    agreementDate: {
      id: 'ta.cov.application:overview.labels.agreementDate',
      defaultMessage: 'Dagsetning samnings:',
      description: 'Agreement date label',
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
