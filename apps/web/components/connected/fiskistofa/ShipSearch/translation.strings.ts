import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  shipDetailsHref: {
    id: 'web.fiskistofaShipSearch:shipDetailsHref',
    defaultMessage: '/v/gagnasidur-fiskistofu?selectedTab=skip',
    description: 'Slóða á valið skip',
  },
  shipDetailsNumberQueryParam: {
    id: 'web.fiskistofaShipSearch:shipDetailsNumberQueryParam',
    defaultMessage: 'nr',
    description: 'nr',
  },
  searchStringIsTooShort: {
    id: 'web.fiskistofaShipSearch:searchStringIsTooShort',
    defaultMessage: 'Leitarstrengur þarf að vera a.m.k. 2 stafir',
    description: 'Leitarstrengur þarf að vera a.m.k. 2 stafir',
  },
  shipSearchInputLabel: {
    id: 'web.fiskistofaShipSearch:shipSearchInputLabel',
    defaultMessage: 'Skipaskrárnúmer eða nafn skips',
    description: 'Skipaskrárnúmer eða nafn skips',
  },
  search: {
    id: 'web.fiskistofaShipSearch:search',
    defaultMessage: 'Leita',
    description: 'Leita',
  },
  noResultsFound: {
    id: 'web.fiskistofaShipSearch:noResultsFound',
    defaultMessage: 'Engar niðurstöður fundust',
    description: 'Engar niðurstöður fundust',
  },
  errorOccuredWhileFetchingShips: {
    id: 'web.fiskistofaShipSearch:errorOccuredWhileFetchingShips',
    defaultMessage: 'Villa kom upp við að leita eftir skipi',
    description: 'Texti fyrir villu skilaboð þegar ekki tekst að sækja gögn',
  },
  resultsFound: {
    id: 'web.fiskistofaShipSearch:resultsFound',
    defaultMessage: 'Fjöldi skipa:',
    description: 'Fjöldi skipa:',
  },
  shipNumber: {
    id: 'web.fiskistofaShipSearch:shipNumber',
    defaultMessage: 'Skipnr.',
    description: 'Skipa númer',
  },
  shipName: {
    id: 'web.fiskistofaShipSearch:shipName',
    defaultMessage: 'Nafn',
    description: 'Nafn',
  },
  typeOfVessel: {
    id: 'web.fiskistofaShipSearch:typeOfVessel',
    defaultMessage: 'Útgerðarflokkur',
    description: 'Útgerðarflokkur',
  },
  operator: {
    id: 'web.fiskistofaShipSearch:operator',
    defaultMessage: 'Útgerð',
    description: 'Útgerð',
  },
  homePort: {
    id: 'web.fiskistofaShipSearch:homePort',
    defaultMessage: 'Heimahöfn',
    description: 'Heimahöfn',
  },
})
