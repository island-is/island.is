import { defineMessages } from 'react-intl'

export const completed = {
  general: defineMessages({
    alertTitle: {
      id: 'aa.application:completed.general.alertTitle',
      defaultMessage: 'Umsókn send til Vinnumálastofnunar!',
      description: 'alert title on complete screen',
    },
    alertMessage: {
      id: 'aa.application:completed.general.alertMessage',
      defaultMessage:
        'Eftirfarandi umsókn hefur verið send til Vinnumálastofnunar til úrvinnslu.',
      description: 'alert message on complete screen',
    },
    expandableIntro: {
      id: 'aa.application:completed.general.expandableIntro',
      defaultMessage:
        'Vinnumálastofnun mun senda þér skilaboð á netfangið þitt eða í pósthólfið á Ísland.is þegar niðurstaða hefur fengist. Þú færð einnig hnipp í síma.',
      description: 'expandable intro text on complete screen',
    },
    bottomButtonMessage: {
      id: 'aa.application:completed.general.bottomButtonMessage',
      defaultMessage:
        'Á Mínum síðum Ísland.is getur þú nálgast stöðu umsóknarinnar ásamt öðrum upplýsingum.',
      description: 'bottom button message on complete screen',
    },
  }),
}
