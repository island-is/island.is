import { defineMessages } from 'react-intl'

export const m = defineMessages({
  address: {
    id: 'web.lyfjastofnunHealthProviders:address',
    defaultMessage: 'Heimilisfang',
    description: 'Label for pharmacy address',
  },
  postalAddress: {
    id: 'web.lyfjastofnunHealthProviders:postalAddress',
    defaultMessage: 'Póstfang',
    description: 'Label for pharmacy postal address',
  },
  phone: {
    id: 'web.lyfjastofnunHealthProviders:phone',
    defaultMessage: 'Sími',
    description: 'Label for pharmacy phone number',
  },
  email: {
    id: 'web.lyfjastofnunHealthProviders:email',
    defaultMessage: 'Netfang',
    description: 'Label for pharmacy email address',
  },
  fax: {
    id: 'web.lyfjastofnunHealthProviders:fax',
    defaultMessage: 'Fax',
    description: 'Label for fax number',
  },
  licenseHolder: {
    id: 'web.lyfjastofnunHealthProviders:licenseHolder',
    defaultMessage: 'Lyfsöluleyfishafi',
    description: 'Label for pharmacy license holder',
  },
  operator: {
    id: 'web.lyfjastofnunHealthProviders:operator',
    defaultMessage: 'Rekstraraðili',
    description: 'Label for pharmacy operator',
  },
  nationalIdPrefix: {
    id: 'web.lyfjastofnunHealthProviders:nationalIdPrefix',
    defaultMessage: 'kt.',
    description: 'Prefix shown before national ID (kennitala)',
  },
  search: {
    id: 'web.lyfjastofnunHealthProviders:search',
    defaultMessage: 'Leit',
    description: 'Label for pharmacy name search input',
  },
  searchPlaceholder: {
    id: 'web.lyfjastofnunHealthProviders:searchPlaceholder',
    defaultMessage: 'Leita að apóteki',
    description: 'Placeholder for pharmacy name search input',
  },
  regionLabel: {
    id: 'web.lyfjastofnunHealthProviders:regionLabel',
    defaultMessage: 'Landshluti',
    description: 'Label for region filter dropdown',
  },
  regionCapital: {
    id: 'web.lyfjastofnunHealthProviders:regionCapital',
    defaultMessage: 'Höfuðborgarsvæðið',
    description: 'Region name: Capital Region',
  },
  regionSouth: {
    id: 'web.lyfjastofnunHealthProviders:regionSouth',
    defaultMessage: 'Suðurland og Reykjanes',
    description: 'Region name: South Iceland and Reykjanes',
  },
  regionWest: {
    id: 'web.lyfjastofnunHealthProviders:regionWest',
    defaultMessage: 'Vesturland og Vestfirðir',
    description: 'Region name: West Iceland and Westfjords',
  },
  regionNorth: {
    id: 'web.lyfjastofnunHealthProviders:regionNorth',
    defaultMessage: 'Norðurland',
    description: 'Region name: North Iceland',
  },
  regionEast: {
    id: 'web.lyfjastofnunHealthProviders:regionEast',
    defaultMessage: 'Austurland',
    description: 'Region name: East Iceland',
  },
  noResults: {
    id: 'web.lyfjastofnunHealthProviders:noResults',
    defaultMessage: 'Engar niðurstöður fundust',
    description: 'Message shown when no pharmacies match the current filters',
  },
  regionAll: {
    id: 'web.lyfjastofnunHealthProviders:regionAll',
    defaultMessage: 'Allir landshlutar',
    description:
      'Placeholder shown in region dropdown when no region is selected',
  },
  errorMessage: {
    id: 'web.lyfjastofnunHealthProviders:errorMessage',
    defaultMessage: 'Villa kom upp við að sækja gögn',
    description:
      'Error message shown when health provider data cannot be fetched',
  },
})
