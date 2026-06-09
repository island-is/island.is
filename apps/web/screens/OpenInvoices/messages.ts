import { defineMessages } from 'react-intl'

export const m = {
  overview: defineMessages({
    title: {
      id: 'web.openinvoices:overview.title',
      defaultMessage: 'Yfirlit reikninga',
    },
    description: {
      id: 'web.openinvoices:overview.description',
      defaultMessage:
        'Hér má skoða þá reikninga sem greiddir hafa verið á völdu tímabili. Hver seljandi birtist í eigin línu og með því að opna staka línu sjást einstakir reikningar. Nota má leit og síun til að þrengja listann.',
    },
    featuredImage: {
      id: 'web.openinvoices:overview.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/3SAzg9pelYc1wtrlgAZlag/dee0db5d44b5bfd6a9b9a436ccb6372a/LE_-_Jobs_-_M1.png',
    },
    featuredImageAlt: {
      id: 'web.openinvoices:overview.featuredImageAlt',
      defaultMessage: 'Mynd af konu við tölvu',
    },
    supplier: {
      id: 'web.openinvoices:overview.supplier',
      defaultMessage: 'Seljandi',
    },
    customer: {
      id: 'web.openinvoices:overview.customer',
      defaultMessage: 'Kaupandi',
    },
    amount: {
      id: 'web.openinvoices:overview.amount',
      defaultMessage: 'Upphæð',
    },

    searchTitle: {
      id: 'web.openinvoices:overview.searchTitle',
      defaultMessage: 'Leit og síun',
    },
    emptyTable: {
      id: 'web.openinvoices:overview.emptyTable',
      defaultMessage: 'Engar upplýsingar til að birta',
    },
    noResults: {
      id: 'web.openinvoices:overview.noResults',
      defaultMessage: 'Ekkert fannst. Prófaðu að breyta skilyrðum',
    },
    errorLoading: {
      id: 'web.openinvoices:overview.errorLoading',
      defaultMessage: 'Villa kom upp við að sækja gögn',
    },
    headerLink1Title: {
      id: 'web.openinvoices:overview.link1Title',
      defaultMessage: 'Um vefinn',
    },
    headerLink2Title: {
      id: 'web.openinvoices:overview.link2Title',
      defaultMessage: 'Birtingarreglur',
    },
    headerLink1Url: {
      id: 'web.openinvoices:overview.link1Url',
      defaultMessage: 'todo',
    },
    headerLink2Url: {
      id: 'web.openinvoices:overview.link2Url',
      defaultMessage: 'todo',
    },
  }),
  totals: defineMessages({
    total: {
      id: 'web.openinvoices:totals.total',
      defaultMessage: 'Samtals',
    },
  }),
  search: defineMessages({
    filterTitle: {
      id: 'web.openinvoices:search.filterTitle',
      defaultMessage: 'Leitarsíur',
    },
    filter: {
      id: 'web.openinvoices:search.filter',
      defaultMessage: 'Síun',
    },
    clearFilters: {
      id: 'web.openinvoices:search.clearFilters',
      defaultMessage: 'Hreinsa allar síur',
    },
    openFilter: {
      id: 'web.openinvoices:search.openFilter',
      defaultMessage: 'Opna síu',
    },
    closeFilter: {
      id: 'web.openinvoices:search.closeFilter',
      defaultMessage: 'Loka síu',
    },
    clearFilterCategory: {
      id: 'web.openinvoices:search.clearFilterCategory',
      defaultMessage: 'Hreinsa síu',
    },
    range: {
      id: 'web.openinvoices:search.range',
      defaultMessage: 'Tímabil',
    },
    types: {
      id: 'web.openinvoices:search.types',
      defaultMessage: 'Tegundir',
    },
    suppliers: {
      id: 'web.openinvoices:search.suppliers',
      defaultMessage: 'Seljendur',
    },
    customers: {
      id: 'web.openinvoices:search.customers',
      defaultMessage: 'Kaupendur',
    },
    viewResults: {
      id: 'web.openinvoices:search.viewResults',
      defaultMessage: 'Skoða niðurstöður',
    },
    resultFound: {
      id: 'web.openinvoices:search.resultFound#markdown',
      defaultMessage:
        '1 færsla fannst fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}** samtals **{sum}**',
    },
    resultsFound: {
      id: 'web.openinvoices:search.resultsFound#markdown',
      defaultMessage:
        '**{records}** færslur fundust fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}** samtals **{sum}**',
    },
    filterSearch: {
      id: 'web.openinvoices:search.filterSearch',
      defaultMessage: 'Leita...',
    },
    loadMore: {
      id: 'web.openinvoices:search.loadMore',
      defaultMessage: 'Sækja fleiri',
    },
  }),
}
