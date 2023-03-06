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
        description: 'Pick plate label',
      },
      placeholder: {
        id: 'ta.lpr.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu einkanúmer',
        description: 'Pick plate placeholder',
      },
      hasErrorTitle: {
        id: 'ta.lpr.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að endurnýja einkanúmer vegna:',
        description: 'Pick plate has an error title',
      },
      isNotDebtLessTag: {
        id:
          'ta.lpr.application:information.labels.pickVehicle.isNotDebtLessTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick plate is not debt less tag',
      },
      expiresTag: {
        id: 'ta.lpr.application:information.labels.pickVehicle.expiresTag',
        defaultMessage: 'Rennur út {date}',
        description: 'Pick plate expires tag',
      },
    }),
    information: defineMessages({
      sectionTitle: {
        id: 'ta.lpr.application:information.labels.information.sectionTitle',
        defaultMessage: 'Einkanúmer',
        description: 'Information section title',
      },
      title: {
        id: 'ta.lpr.application:information.labels.information.title',
        defaultMessage: 'Upplýsingar um einkanúmer',
        description: 'Information title',
      },
      description: {
        id: 'ta.lpr.application:information.labels.information.description',
        defaultMessage: 'Einkanúmer er aðeins sent á lögheimili eigenda',
        description: 'Information description',
      },
      plate: {
        id: 'ta.lpr.application:information.labels.information.plate',
        defaultMessage: 'Einkanúmer',
        description: 'Information plate label',
      },
      newValidPeriod: {
        id: 'ta.lpr.application:information.labels.information.newValidPeriod',
        defaultMessage: 'Nýr gildistími',
        description: 'Information new valid period label',
      },
      dateFrom: {
        id: 'ta.lpr.application:information.labels.information.dateFrom',
        defaultMessage: 'Dagsetning frá ',
        description: 'Information date from label',
      },
      dateTo: {
        id: 'ta.lpr.application:information.labels.information.dateTo',
        defaultMessage: 'Dagsetning til',
        description: 'Information date to label',
      },
      beneficiary: {
        id: 'ta.lpr.application:information.labels.information.beneficiary',
        defaultMessage: 'Rétthafi',
        description: 'Information beneficiary label',
      },
      nationalId: {
        id: 'ta.lpr.application:information.labels.information.nationalId',
        defaultMessage: 'Kennitala',
        description: 'Information beneficiary national id label',
      },
      name: {
        id: 'ta.lpr.application:information.labels.information.name',
        defaultMessage: 'Nafn eiganda',
        description: 'Information beneficiary name label',
      },
    }),
  },
}
