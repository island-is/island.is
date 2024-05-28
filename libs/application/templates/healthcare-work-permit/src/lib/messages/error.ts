import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hwp.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyCareerResponseTitle: {
    id: 'hlc.application:error.emptyCareerResponseTitle',
    defaultMessage:
      'Samkvæmt þjónustu Háskóla Íslands ertu ekki með brautskráningu á skrá',
    description: 'Empty career response',
  },
  emptyCareerResponseMessage: {
    id: 'hlc.application:error.emptyCareerResponseMessage',
    defaultMessage:
      'Samkvæmt þjónustu Háskóla Íslands ertu ekki með brautskráningu á skrá',
    description: 'Empty career response',
  },
  noResponseEducationInfoTitle: {
    id: 'hlc.application:error.noResponseEducationInfoTitle',
    defaultMessage:
      'Ekki tóks að sækja gögn frá Landlækni, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on education paths',
  },
  noResponseEducationInfoMessage: {
    id: 'hlc.application:error.noResponseEducationInfoMessage',
    defaultMessage:
      'Ekki tóks að sækja gögn frá Landlækni, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on education paths',
  },
  healthcareLicenseErrorTitle: {
    id: 'hlc.application:error.healthcareLicenseErrorTitle',
    defaultMessage:
      'Ekki tókst að sækja gögn frá Landlækni, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on healthcare licenses',
  },
  healthcareLicenseErrorMessage: {
    id: 'hlc.application:error.healthcareLicenseErrorMessage',
    defaultMessage:
      'Ekki tóks að sækja gögn frá Landlækni, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching healthcare licenses',
  },
  nationalRegistryOutsideEESErrorTitle: {
    id: 'hlc.application:error.nationalRegistryOutsideEESErrorTitle',
    defaultMessage: 'Þú ert ekki ríkisborgari innan EES',
    description: 'You are not a citizen within EES',
  },
  nationalRegistryOutsideEESErrorMessage: {
    id: 'hlc.application:error.nationalRegistryOutsideEESErrorMessage',
    defaultMessage: 'Þú ert ekki ríkisborgari innan EES',
    description: 'You are not a citizen within EES',
  },
  nationalRegistryFetchErrorTitle: {
    id: 'hlc.application:error.nationalRegistryFetchErrorTitle',
    defaultMessage:
      'Ekki tókst að sækja gögn frá þjóðskrá, vinsamlegast prufaðu aftur seinna',
    description:
      'No response or faulty response when fetching info on current user from nation registry',
  },
  nationalRegistryFetchErrorMessage: {
    id: 'hlc.application:error.nationalRegistryFetchErrorMessage',
    defaultMessage: 'Lorem ipsum',
    description:
      'No response or faulty response when fetching info on current user from nation registry',
  },
  noPermitValidGraduationFoundTitle: {
    id: 'hlc.application:error.noPermitValidGraduationFoundTitle',
    defaultMessage: 'Ekki fundust brautskráningar sem gefa starfsleyfi',
    description: 'No graduated programs found that are valid form work permit',
  },
  noPermitValidGraduationFoundMessage: {
    id: 'hlc.application:error.noPermitValidGraduationFoundMessage',
    defaultMessage: 'Ekki fundust brautskráningar sem gefa starfsleyfi',
    description: 'No graduated programs found that are valid form work permit',
  },
})
