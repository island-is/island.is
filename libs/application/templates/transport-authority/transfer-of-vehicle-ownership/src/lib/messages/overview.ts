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
    buyersCoOwner: {
      id: 'ta.tvo.application:overview.labels.buyersCoOwner',
      defaultMessage: 'Meðeigandi kaupanda',
      description: 'Buyers co owner label',
    },
    addCoOwnerAndOperatorButton: {
      id: 'ta.tvo.application:overview.labels.addCoOwnerAndOperatorButton',
      defaultMessage: 'Bæta við meðeiganda /umráðamanni',
      description: 'Add co owner and operator button',
    },
    insuranceTitle: {
      id: 'ta.tvo.application:overview.labels.insuranceTitle',
      defaultMessage: 'Tryggingafélag',
      description: 'Insurance company title',
    },
    noChosenInsurance: {
      id: 'ta.tvo.application:overview.labels.noChosenInsurance',
      defaultMessage: 'Ekkert tryggingafélag er valið',
      description: 'User has not chosen an insurance company',
    },
    addInsuranceButton: {
      id: 'ta.tvo.application:overview.labels.addInsuranceButton',
      defaultMessage: 'Skrá tryggingafélag',
      description: 'Add insurance company button',
    },
    salePrice: {
      id: 'ta.tvo.application:overview.labels.salePrice',
      defaultMessage: 'Söluverð:',
      description: 'Saleprice label',
    },
    agreementDate: {
      id: 'ta.tvo.application:overview.labels.agreementDate',
      defaultMessage: 'Dagsetning samnings:',
      description: 'Agreement date label',
    },
    mileage: {
      id: 'ta.tvo.application:overview.labels.mileage',
      defaultMessage: 'Kílómetrar:',
      description: 'Mileage label',
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'ta.tvo.application:overview.confirmationModal.title',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'ta.tvo.application:overview.confirmationModal.text',
      defaultMessage: 'Þú ert að fara að hafna tilkynningu.',
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'ta.tvo.application:overview.confirmationModal.buttonText',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'ta.tvo.application:overview.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
