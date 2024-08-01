import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hwp.application:error.dataProvider',
    defaultMessage: 'Ekki tókst að sækja gögn, vinsamlegast reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyCareerResponseTitle: {
    id: 'hwp.application:error.emptyCareerResponseTitle',
    defaultMessage:
      'Samkvæmt þjónustu Háskóla Íslands ertu ekki með brautskráningu á skrá',
    description: 'Empty career response',
  },
  emptyCareerResponseMessage: {
    id: 'hwp.application:error.emptyCareerResponseMessage#markdown',
    defaultMessage:
      '* Ekki eru upplýsingar um brautskráningu frá HÍ eða HA úr löggildri heilbrigðsstétt \n* Brautskráning úr HÍ eða HA fyrir 1. janúar 2024 \n* Starfsleyfi nú þegar til staðar \n\n### Vinsamlega skoðið https://island.is/starfsleyfi-heilbrigdisstarfsmanna',
    description: 'Empty career response',
  },
  noResponseEducationInfoTitle: {
    id: 'hwp.application:error.noResponseEducationInfoTitle',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Landlækni, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on education paths',
  },
  noResponseEducationInfoMessage: {
    id: 'hwp.application:error.noResponseEducationInfoMessage',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Embætti Landlæknis, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on education paths',
  },
  healthcareLicenseErrorTitle: {
    id: 'hwp.application:error.healthcareLicenseErrorTitle',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Embætti Landlæknis, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on healthcare licenses',
  },
  healthcareLicenseErrorMessage: {
    id: 'hwp.application:error.healthcareLicenseErrorMessage',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Embætti Landlæknis, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching healthcare licenses',
  },
  nationalRegistryOutsideEESErrorTitle: {
    id: 'hwp.application:error.nationalRegistryOutsideEESErrorTitle',
    defaultMessage: 'Þú ert ekki ríkisborgari innan EES',
    description: 'You are not a citizen within EES',
  },
  nationalRegistryOutsideEESErrorMessage: {
    id: 'hwp.application:error.nationalRegistryOutsideEESErrorMessage',
    defaultMessage: 'Þú ert ekki ríkisborgari innan EES',
    description: 'You are not a citizen within EES',
  },
  nationalRegistryFetchErrorTitle: {
    id: 'hwp.application:error.nationalRegistryFetchErrorTitle',
    defaultMessage:
      'Ekki tókst að sækja gögn frá þjóðskrá, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on current user from nation registry',
  },
  nationalRegistryFetchErrorMessage: {
    id: 'hwp.application:error.nationalRegistryFetchErrorMessage',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Þjóðskrá, vinsamlegast reyndu aftur síðar',
    description:
      'No response or faulty response when fetching info on current user from nation registry',
  },
  noPermitValidGraduationFoundTitle: {
    id: 'hwp.application:error.noPermitValidGraduationFoundTitle',
    defaultMessage: 'Ekki fundust brautskráningar sem gefa starfsleyfi',
    description: 'No graduated programs found that are valid form work permit',
  },
  noPermitValidGraduationFoundMessage: {
    id: 'hwp.application:error.noPermitValidGraduationFoundMessage#markdown',
    defaultMessage: 'Ekki fundust brautskráningar sem gefa starfsleyfi',
    description: 'No graduated programs found that are valid form work permit',
  },
  noPermitValidForSelfServiceTitle: {
    id: 'hwp.application:error.noPermitValidForSelfServiceTitle',
    defaultMessage:
      'Ekki fundust brautskráningar sem geta farið í gegnum sjálfsafgreiðslu, vinsamlega hafðu samband við Embætti Landlæknis',
    description: 'No graduated programs found that can go through self service',
  },
  noPermitValidForSelfServiceMessage: {
    id: 'hwp.application:error.noPermitValidForSelfServiceMessage#markdown',
    defaultMessage:
      'Ekki fundust brautskráningar sem geta farið í gegnum sjálfsafgreiðslu, vinsamlega hafðu samband við Embætti Landlæknis',
    description: 'No graduated programs found that can go through self service',
  },
})
