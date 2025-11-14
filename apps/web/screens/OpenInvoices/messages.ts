import { defineMessages } from 'react-intl'

export const m = {
  home: defineMessages({
    title: {
      id: 'web.openinvoices:home.title',
      defaultMessage: 'Opnir reikningar',
    },
    description: {
      id: 'web.openinvoices:home.description',
      defaultMessage:
        'Upplýsingar um alla greidda reikninga ráðuneyta og stofnana úr bókhaldi ríkisins. Gögn eru uppfærð 10. hvers mánaðar. Athugið að hér er ekki að finna kostnað á borð við launagreiðslur og vaxtagjöld.',
    },
    featuredImage: {
      id: 'web.openinvoices:home.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
    },
    featuredImageAlt: {
      id: 'web.openinvoices:home.featuredImageAlt',
      defaultMessage: 'Mynd af konu við tölvu',
    },
  }),
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
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
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
    searchInputPlaceholder: {
      id: 'web.openinvoices:overview.searchInputPlaceholder',
      defaultMessage: 'Leita í reikningum',
    },
  }),
  search: defineMessages({
    filterTitle: {
      id: 'web.openinvoices:search.filterTitle',
      defaultMessage: 'Leitarsíur',
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

    type: {
      id: 'web.openinvoices:search.type',
      defaultMessage: 'Tegund',
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
        '**{records}** færslur fundust fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}** samtals **{sum} kr.**',
    },
    noResultsFound: {
      id: 'web.openinvoices:search.noResultsFound',
      defaultMessage: 'Engar færslur fundust',
    },
  }),
}
