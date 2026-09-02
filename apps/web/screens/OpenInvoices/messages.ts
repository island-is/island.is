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
        'https://images.ctfassets.net/8k0h54kbe6bj/4tLK38mf8CR1ktUQjhFQl1/2de64c6115fc70d8168fa597715c17a3/LE_-_Company_-_M3.svg',
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
      defaultMessage:
        '1 greiðsla fannst fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}** samtals **{sum}**',
    },
    resultFoundNoSum: {
      id: 'web.openinvoices:search.resultFoundNoSum#markdown',
      defaultMessage:
        '1 greiðsla fannst fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}**',
    },
    resultsFound: {
      id: 'web.openinvoices:search.resultsFound#markdown',
      defaultMessage:
        '**{records}** greiðslur fundust fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}** samtals **{sum}**',
    },
    resultsFoundNoSum: {
      id: 'web.openinvoices:search.resultsFoundNoSum#markdown',
      defaultMessage:
        '**{records}** greiðslur fundust fyrir tímabilið **{dateRangeStart}-{dateRangeEnd}**',
    },
    recordsFoundShort: {
      id: 'web.openinvoices:search.recordsFoundShort#markdown',
      defaultMessage:
        '**{records}** {records, plural, one {greiðsla fannst} other {greiðslur fundust}}',
    },
    dateRangeLineShort: {
      id: 'web.openinvoices:search.dateRangeLineShort#markdown',
      defaultMessage: 'Tímabil: **{dateRangeStart}-{dateRangeEnd}**',
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
  }),
}
