import { defineMessages } from 'react-intl'

export const serviceErrors = defineMessages({
  successErrorTitle: {
    id: 'aa.application:successErrorTitle',
    defaultMessage: 'Villa kom upp',
    description: `Application's name`,
  },
  successErrorSummary: {
    id: 'aa.application:successErrorSummary',
    defaultMessage:
      'Ekki tókst að sækja gögn Vinnumálastofnunar, vinsamlegast reyndu aftur síða',
    description: `Application's name`,
  },
  cannotApplyErrorTitle: {
    id: 'aa.application:cannotApplyErrorTitle',
    defaultMessage: 'Villa kom upp',
    description: `Application's name`,
  },
  cannotApplyErrorSummary: {
    id: 'aa.application:cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum getur viðkomandi ekki sótt um virknistyrk, ef þú telur að mistök séu að ræða vinsamlegast hafðu samband við Vinnumálastofnun',
    description: `Application's name`,
  },
})
