import { defineMessages } from 'react-intl'

export const m = defineMessages({
  director: {
    id: 'web.syslumenn.religiousOrganizationList:director',
    defaultMessage: 'Forstöðumaður',
    description: 'Forstöðumaður',
  },
  homeAddress: {
    id: 'web.syslumenn.religiousOrganizationList:homeAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Heimilisfang',
  },
  name: {
    id: 'web.syslumenn.religiousOrganizationList:name',
    defaultMessage: 'Nafn',
    description: 'Nafn',
  },
  errorTitle: {
    id: 'web.syslumenn.religiousOrganizationList:errorTitle',
    defaultMessage: 'Villa',
    description: 'Titill á villuskilaboðum ef ekki tókst að sækja lista',
  },
  errorMessage: {
    id: 'web.syslumenn.religiousOrganizationList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja lista.',
    description: 'Villuskilaboð ef ekki tókst að sækja lista',
  },
  loadMore: {
    id: 'web.syslumenn.religiousOrganizationList:loadMore',
    defaultMessage: 'Sjá fleiri',
    description: 'Sjá fleiri',
  },
  noResults: {
    id: 'web.syslumenn.religiousOrganizationList:noResults',
    defaultMessage: 'Engar niðurstöður fundust',
    description: 'Texti sem birtist ef engar niðurstöður fundust',
  },
  searchPlaceholder: {
    id: 'web.syslumenn.religiousOrganizationList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Placeholder texti í leitarboxi',
  },
  csvButtonLabelDefault: {
    id: 'web.syslumenn.religiousOrganizationList:csvButtonLabelDefault',
    defaultMessage: 'Sækja öll leyfi (CSV).',
    description: 'Texti fyrir CSV hnapp',
  },
  csvButtonLabelLoading: {
    id: 'web.syslumenn.religiousOrganizationList:csvButtonLabelLoading',
    defaultMessage: 'Sæki...',
    description: 'Texti þegar smellt er á CSV hnapp',
  },
  csvButtonLabelError: {
    id: 'web.syslumenn.religiousOrganizationList:csvButtonLabelError',
    defaultMessage: 'Ekki tókst að sækja lista, reyndu aftur.',
    description: 'Texti fyrir CSV hnapp ef ekki tókst að sækja skrá',
  },
  csvFileTitlePrefix: {
    id: 'web.syslumenn.religiousOrganizationList:csvFileTitlePrefix',
    defaultMessage: 'Trúfélög og lífsskoðunarfélög',
    description: 'Titill á CSV skrá',
  },
})
