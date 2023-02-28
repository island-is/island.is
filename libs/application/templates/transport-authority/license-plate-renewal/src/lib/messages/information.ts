import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.lpr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.lpr.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'ta.lpr.application:information.general.description',
      defaultMessage:
        'Nam euismod est quis sagittis tempor. Pellentesque condimentum risus sapien, at imperdiet odio commodo at. Vestibulum facilisis rhoncus lorem.',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickPlate: defineMessages({
      sectionTitle: {
        id: 'ta.lpr.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu einkamerki',
        description: 'Pick plate section title',
      },
      title: {
        id: 'ta.lpr.application:information.labels.pickVehicle.title',
        defaultMessage: 'Einkamerki í þinni eigu',
        description: 'Pick plate title',
      },
      description: {
        id: 'ta.lpr.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Ath. Aðeins er hægt að endurnýja einkamerki allt að þremur mánuðum áður en það rennur út.',
        description: 'Pick plate description',
      },
      plate: {
        id: 'ta.lpr.application:information.labels.pickVehicle.plate',
        defaultMessage: 'Einkanúmer',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ta.lpr.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu einkanúmer',
        description: 'Pick vehicle placeholder',
      },
      hasErrorTitle: {
        id: 'ta.lpr.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að endurnýja einkanúmer vegna:',
        description: 'Pick vehicle has an error title',
      },
      isNotDebtLessTag: {
        id:
          'ta.lpr.application:information.labels.pickVehicle.isNotDebtLessTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick vehicle is not debt less tag',
      },
    }),
  },
}
