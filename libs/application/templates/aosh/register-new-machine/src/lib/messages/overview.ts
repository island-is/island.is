import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    title: {
      id: 'aosh.rnm.application:overview.general.title',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview screen',
    },
    sectionTitle: {
      id: 'aosh.rnm.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview screen',
    },
    description: {
      id: 'aosh.rnm.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview screen',
    },
  }),
  labels: defineMessages({
    changeInformationButton: {
      id: 'aosh.rnm.application:overview.labels.changeInformationButton',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Overview change information button',
    },
    alertMessageTitle: {
      id: 'aosh.rnm.application:overview.labels.alerMessageTitle',
      defaultMessage: 'Götuskráning',
      description: 'Overview alert message title',
    },
    alertMessageMessage: {
      id: 'aosh.rnm.application:overview.labels.alertMessageMessage',
      defaultMessage:
        'Tæki í flokkum IA, IF, IM, JL og KG uppfylla oft ekki kröfur um gerð og búnað ökutækja og þarf að sækja sérstaklega um götuskráningu þeirra með því að hafa samband við þjónustuver Vinnueftirlitsins.',
      description: 'Overview alert message',
    },
  }),
}
