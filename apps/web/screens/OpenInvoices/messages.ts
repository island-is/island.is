import { defineMessages } from 'react-intl'

export const m = {
  shared: defineMessages({
    title: {
      id: 'web.openinvoices:shared.title',
      defaultMessage: 'Opnir reikningar',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'web.openinvoices:overview.title',
      defaultMessage: 'Yfirlit yfir greiðslur',
    },
    description: {
      id: 'web.openinvoices:overview.description',
      defaultMessage:
        'Yfirlitið sýnir heildargreiðslur á völdu tímabili. Með því að opna staka línu sést sundurliðun á greiðslum og reikningum sem þær tengjast. Nota má leit og síun til að þrengja listann.',
    },
    featuredImage: {
      id: 'web.openinvoices:overview.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/3GD65AzjZTv6TEguWRWyKQ/7d7ca644d742d5ded3f5a7cac84169c2/skjaldarmerki-bla-linuteikning.svg',
    },
    featuredImageAlt: {
      id: 'web.openinvoices:overview.featuredImageAlt',
      defaultMessage: 'Mynd af skrifborði og skrifborðsstól',
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
    noResultsTitle: {
      id: 'web.openinvoices:overview.noResultsTitle',
      defaultMessage: 'Engir greiðslur fundust',
    },
    noResultsDescription: {
      id: 'web.openinvoices:overview.noResultsDescription',
      defaultMessage:
        'Þau skilyrði sem leitað er eftir skiluðu engum niðurstöðum.',
    },
    noResultsIllustrationAlt: {
      id: 'web.openinvoices:overview.noResultsIllustrationAlt',
      defaultMessage: '',
    },
    errorLoading: {
      id: 'web.openinvoices:overview.errorLoading',
      defaultMessage: 'Villa kom upp við að sækja gögn',
    },
    errorTitle: {
      id: 'web.openinvoices:overview.errorTitle',
      defaultMessage: 'Villa kom upp',
    },
    expandRow: {
      id: 'web.openinvoices:overview.expandRow',
      defaultMessage: 'Skoða nánar',
    },
    srCaption: {
      id: 'web.openinvoices:overview.srCaption',
      defaultMessage: 'Tafla með yfirliti reikninga',
    },
    sortHint: {
      id: 'web.openinvoices:overview.sortHint',
      defaultMessage: 'Takkar í dálkahausum stýra röðun þess dálks',
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
      defaultMessage: 'Samtals greitt',
    },
    invoiceAmount: {
      id: 'web.openinvoices:totals.invoiceAmount',
      defaultMessage: 'Upphæð reiknings',
    },
    paid: {
      id: 'web.openinvoices:totals.paidAmount',
      defaultMessage: 'Greitt',
    },
    invoiceHeading: {
      id: 'web.openinvoices:totals.invoiceHeading',
      defaultMessage:
        'Reikningur {number}{linked, select, true { - tengist fleiri greiðslum} other {}}',
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
    dateFrom: {
      id: 'web.openinvoices:search.dateFrom',
      defaultMessage: 'Frá',
    },
    dateTo: {
      id: 'web.openinvoices:search.dateTo',
      defaultMessage: 'Til',
    },
    types: {
      id: 'web.openinvoices:search.types',
      defaultMessage: 'Flokkun',
    },
    suppliers: {
      id: 'web.openinvoices:search.suppliers',
      defaultMessage: 'Seljendur',
    },
    customers: {
      id: 'web.openinvoices:search.customers',
      defaultMessage: 'Kaupendur',
    },
    ministries: {
      id: 'web.openinvoices:search.ministries',
      defaultMessage: 'Stofnanir ráðuneyta',
    },
    viewResults: {
      id: 'web.openinvoices:search.viewResults',
      defaultMessage: 'Skoða niðurstöður',
    },
    resultFound: {
      id: 'web.openinvoices:search.resultFound#markdown',
      defaultMessage: '1 færsla fannst fyrir valið tímabil, samtals **{sum}**',
    },
    resultFoundNoSum: {
      id: 'web.openinvoices:search.resultFoundNoSum#markdown',
      defaultMessage: '1 færsla fannst fyrir valið tímabil',
    },
    resultsFound: {
      id: 'web.openinvoices:search.resultsFound#markdown',
      defaultMessage:
        '**{records}** færslur fundust fyrir valið tímabil, samtals **{sum}**',
    },
    resultsFoundNoSum: {
      id: 'web.openinvoices:search.resultsFoundNoSum#markdown',
      defaultMessage: '**{records}** færslur fundust fyrir valið tímabil',
    },
    recordsFoundShort: {
      id: 'web.openinvoices:search.recordsFoundShort#markdown',
      defaultMessage:
        '**{records}** {records, plural, one {færsla fannst} other {færslur fundust}}',
    },
    totalLineShort: {
      id: 'web.openinvoices:search.totalLineShort#markdown',
      defaultMessage: 'Samtals: **{sum}**',
    },
    filterSearch: {
      id: 'web.openinvoices:search.filterSearch',
      defaultMessage: 'Leita...',
    },
    loadingMore: {
      id: 'web.openinvoices:search.loadingMore',
      defaultMessage: 'Sæki fleiri niðurstöður',
    },
    fetchingResults: {
      id: 'web.openinvoices:search.fetchingResults',
      defaultMessage: 'Sækir færslur...',
    },
  }),
}
