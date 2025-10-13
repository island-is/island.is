import { defineMessages } from 'react-intl'

export const serviceErrors = defineMessages({
  successErrorTitle: {
    id: 'aa.application:successErrorTitle',
    defaultMessage: 'Villa kom upp',
    description: `Error title when success is false (network error)`,
  },
  successErrorSummary: {
    id: 'aa.application:successErrorSummary',
    defaultMessage:
      'Ekki tókst að sækja gögn Vinnumálastofnunar, vinsamlegast reyndu aftur síða',
    description: `Error summary when success if false (network error)`,
  },
  cannotApplyErrorTitle: {
    id: 'aa.application:cannotApplyErrorTitle',
    defaultMessage: 'Vinsamlegast athugið',
    description: `Error title when user can not apply`,
  },
  cannotApplyErrorSummary: {
    id: 'aa.application:cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum getur viðkomandi ekki sótt um virknistyrk, ef þú telur að mistök séu að ræða vinsamlegast hafðu samband við Vinnumálastofnun',
    description: `Error summary when user can not apply`,
  },
  bankInfoNetworkFail: {
    id: 'aa.application:bankInfoNetworkFail',
    defaultMessage:
      'Ekki tókst að staðfesta bankaupplýsingar, ef villa endurtekur sig vinsamlegast hafið samband við Vinnumálastofnun',
    description: `Error summary when network call fails to validate bank info`,
  },
  bankInfoNotValid: {
    id: 'aa.application:bankInfoNotValid',
    defaultMessage:
      'Bankaupplýsingar ekki skráðar á notanda, athugaðu hvort bankaupplýsingar séu rétt slegnar inn',
    description: `Error summary when users bank info is no valid`,
  },
  cvS3Error: {
    id: 'aa.application:cvS3Error',
    defaultMessage:
      'Tókst ekki að sækja ferilskrá, vinsamlegast reyndu aftur eða fjarlægðu ferilskrá, ef villa endurtekur sig hafið samband við Ísland.is',
    description: `Error summary when s3 fetching fails`,
  },
})
