import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'an.application:general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratrygginga Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    institutionName: {
      id: 'an.application:application.institutionName',
      defaultMessage: 'Sjúkratryggingar Íslands',
      description: 'Sjúkratryggingar Íslands',
    },
    yesOptionLabel: {
      id: 'an.application:application.yesOptionLabel',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    noOptionLabel: {
      id: 'an.application:application.noOptionLabel',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  deliveryOfData: defineMessages({
    name: {
      id: 'an.application:deliveryOfData.name',
      defaultMessage: 'Afhending skjala',
      description: 'Delivery of data',
    },
  }),
  labels: defineMessages({
    warningTitle: {
      id: 'an.application:application.warningTitle',
      defaultMessage: 'Athugið',
      description: 'Warning',
    },
    warningMessage: {
      id: 'an.application:application.warningDescription',
      defaultMessage:
        'Ef hinn slasaði þiggur greiðslur frá íþróttafélaginu þá er málið meðhöndlað sem vinnuslys.',
      description: 'Warning description',
    },
  }),
}
