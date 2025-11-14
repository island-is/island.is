import { defineMessages } from 'react-intl'

export const serviceErrors = defineMessages({
  successErrorTitle: {
    id: 'vmst.ub.application:successErrorTitle',
    defaultMessage: 'Villa kom upp',
    description: `Error title when success is false (network error)`,
  },
  successErrorSummary: {
    id: 'vmst.ub.application:successErrorSummary',
    defaultMessage:
      'Ekki tókst að sækja gögn Vinnumálastofnunar, vinsamlegast reyndu aftur síða',
    description: `Error summary when success if false (network error)`,
  },
  cannotApplyErrorTitle: {
    id: 'vmst.ub.application:cannotApplyErrorTitle',
    defaultMessage: 'Vinsamlegast athugið',
    description: `Error title when user can not apply`,
  },
  cannotApplyErrorSummary: {
    id: 'vmst.ub.application:cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum getur viðkomandi ekki sótt um atvinnuleysisbætur, ef þú telur að mistök séu að ræða vinsamlegast hafðu samband við Vinnumálastofnun',
    description: `Error summary when user can not apply`,
  },
  bankInfoNetworkFail: {
    id: 'vmst.ub.application:bankInfoNetworkFail',
    defaultMessage:
      'Ekki tókst að staðfesta bankaupplýsingar, ef villa endurtekur sig vinsamlegast hafið samband við Vinnumálastofnun',
    description: `Error summary when network call fails to validate bank info`,
  },
  bankInfoNotValid: {
    id: 'vmst.ub.application:bankInfoNotValid',
    defaultMessage:
      'Bankaupplýsingar ekki skráðar á notanda, athugaðu hvort bankaupplýsingar séu rétt slegnar inn',
    description: `Error summary when users bank info is no valid`,
  },
  cvS3Error: {
    id: 'vmst.ub.application:cvS3Error',
    defaultMessage:
      'Tókst ekki að sækja ferilskrá, vinsamlegast reyndu aftur eða fjarlægðu ferilskrá, ef villa endurtekur sig hafið samband við Ísland.is',
    description: `Error summary when s3 fetching fails`,
  },
  errorUploadingFile: {
    id: 'vmst.ub.application:errorUploadingFile',
    defaultMessage:
      'Tókst ekki að hlaða upp skrá, vinsamlegast reyndu aftur. Ef villa endurtekur sig, hafið samband við Ísland.is',
    description: `Error summary when file upload fails`,
  },
  iUnderstandError: {
    id: 'vmst.ub.application:iUnderstandError',
    defaultMessage:
      'Þú verður að haka í hér fyrir ofan til þess að halda áfram',
    description: 'Error message when user has not checked the agree checkbox',
  },
  submitError: {
    id: 'vmst.ub.application:submitError',
    defaultMessage:
      'Villa við að skila inn umsókn. Reyndu aftur eða hafðuð samband við Ísland.is',
    description: 'Error message when submit fails',
  },
  requiredError: {
    id: 'vmst.ub.application:requiredError',
    defaultMessage: 'Þessi dálkur er skilyrtur',
    description: 'Error message when validation fails',
  },
  acknowledgementError: {
    id: 'vmst.ub.application:acknowledgementError',
    defaultMessage: 'Vantar samþykki',
    description: 'Error message when acknoledgement fails',
  },
})
