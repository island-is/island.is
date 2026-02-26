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
        'https://images.ctfassets.net/8k0h54kbe6bj/3SAzg9pelYc1wtrlgAZlag/dee0db5d44b5bfd6a9b9a436ccb6372a/LE_-_Jobs_-_M1.png',
    },
    featuredImageAlt: {
      id: 'web.openinvoices:home.featuredImageAlt',
      defaultMessage: 'Mynd af konu við tölvu',
    },
    invoiceOverview: {
      id: 'web.openinvoices:home.invoiceOverview',
      defaultMessage: 'Yfirlit reikninga',
    },
    invoices: {
      id: 'web.openinvoices:home.invoices',
      defaultMessage: 'Reikningar',
    },
    categoriesEyebrow: {
      id: 'web.openinvoices:home.categoriesEyebrow',
      defaultMessage: 'Samtals greitt síðastliðna þrjá mánuði',
    },
    categoriesDescription: {
      id: 'web.openinvoices:home.categoriesDescription#markdown',
      defaultMessage:
        'Tölur byggja á greiddum reikningum, án innri viðskipta(reikninga senda milli stofnana). ** Ef sú leið verður farin**',
    },
    categoriesTotal: {
      id: 'web.openinvoices:home.categoriesTotal',
      defaultMessage: '{arg} lækkun',
    },
    invoiceCountTitle: {
      id: 'web.openinvoices:home.invoiceCountTitle',
      defaultMessage: 'Fjöldi skráðra reikninga',
    },
    customerCountTitle: {
      id: 'web.openinvoices:home.customerCountTitle',
      defaultMessage: 'Fjöldi kaupenda',
    },
    supplierCountTitle: {
      id: 'web.openinvoices:home.supplierCountTitle',
      defaultMessage: 'Fjöldi seljenda',
    },
    medianInvoiceAmountTitle: {
      id: 'web.openinvoices:home.medianInvoiceAmountTitle',
      defaultMessage: 'Miðgildi reikningsupphæða',
    },
    chartTitle: {
      id: 'web.openinvoices:home.currentYearPaymentsTitle',
      defaultMessage: 'Greiðslur yfirstandandi árs',
    },
    chartDescription: {
      id: 'web.openinvoices:home.currentYearPaymentsDescription',
      defaultMessage:
        'Grafið sýnir greidda reikninga það sem af er árinu, samanborið við sömu mánuði í fyrra. Allar tölur eru á núvirði',
    },
    cardOneTitle: {
      id: 'web.openinvoices:home.cardOneTitle',
      defaultMessage: 'Um vefinn',
    },
    cardOneDescription: {
      id: 'web.openinvoices:home.cardOneDescription',
      defaultMessage:
        'Markmið með birtingu reikninga er að auka gagnsæi og aðgengi almennings að fjárhagsupplýsingum ríkisins. Á vefnum er unnt að skoða upplýsingar um greidda reikninga ráðuneyta og stofnana úr bókhaldi ríkisins.',
    },
    cardOneLinkText: {
      id: 'web.openinvoices:home.cardOneLinkText',
      defaultMessage: 'Nánar um opna reikninga',
    },
    cardOneLinkUrl: {
      id: 'web.openinvoices:home.cardOneLinkUrl',
      defaultMessage: 'https://www.island.is',
    },
    cardTwoTitle: {
      id: 'web.openinvoices:home.cardTwoTitle',
      defaultMessage: 'Birtingarreglur',
    },
    cardTwoDescription: {
      id: 'web.openinvoices:home.cardTwoDescription#markdown',
      defaultMessage:
        'Vefurinn byggir á greiðslum sem fara í gegnum viðskiptaskuldakerfi stofnana, en þangað fara reikningar fyrir kaup á vörum og þjónustu.  Vegna persónuverndar eru nöfn ekki birt þegar reikningar tengjast kennitölum einstaklinga. Einnig gildir trúnaður um innihald tiltekinna reikninga vegna eðlis þeirra.',
    },
    cardTwoLinkText: {
      id: 'web.openinvoices:home.cardTwoLinkText',
      defaultMessage: 'Sjá nánar',
    },
    cardTwoLinkUrl: {
      id: 'web.openinvoices:home.cardTwoLinkUrl',
      defaultMessage: 'https://www.island.is',
    },
    categoryCardTwoTitle: {
      id: 'web.openinvoices:home.categoryCardTwoTitle',
      defaultMessage: 'Yfirlit reikninga',
    },
    categoryCardTwoDescription: {
      id: 'web.openinvoices:home.categoryCardTwoDescription',
      defaultMessage:
        'Heildarlisti greiddra reikninga á völdu tímabili. Hægt er að velja leitarskilyrði og afmarka þannig hvaða reikningar eru birtir.',
    },
    categoryCardTwoLink: {
      id: 'web.openinvoices:home.categoryCardOneLink',
      defaultMessage: 'https://www.island.is',
    },
    categoryCardOneTitle: {
      id: 'web.openinvoices:home.categoryCardOneTitle',
      defaultMessage: 'Samtölur reikninga',
    },
    categoryCardOneDescription: {
      id: 'web.openinvoices:home.categoryCardOneDescription',
      defaultMessage:
        'Lykiltölfræði á borð við stærstu kaupendur og seljendur á völdu tímabili. Hægt er að kafa frá samtölum niður í einstaka reikninga.',
    },
    categoryCardOneLink: {
      id: 'web.openinvoices:home.categoryCardOneLink',
      defaultMessage: 'https://www.island.is',
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
    searchInputPlaceholder: {
      id: 'web.openinvoices:overview.searchInputPlaceholder',
      defaultMessage: 'Leita í reikningum',
    },
    emptyTable: {
      id: 'web.openinvoices:overview.emptyTable',
      defaultMessage: 'Engar upplýsingar til að birta',
    },
    noResults: {
      id: 'web.openinvoices:overview.noResults',
      defaultMessage: 'Ekkert fannst. Prófaðu að breyta skilyrðum',
    },
  }),
  totals: defineMessages({
    title: {
      id: 'web.openinvoices:totals.title',
      defaultMessage: 'Samtölur reikninga',
    },
    description: {
      id: 'web.openinvoices:totals.description',
      defaultMessage:
        'Allar upphæðir hér miðast við útgjöld heilla mánaða. Þar sem við á eru samanburðartölur birtar á núvirði.',
    },
    featuredImage: {
      id: 'web.openinvoices:totals.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/3SAzg9pelYc1wtrlgAZlag/dee0db5d44b5bfd6a9b9a436ccb6372a/LE_-_Jobs_-_M1.png',
    },
    featuredImageAlt: {
      id: 'web.openinvoices:totals.featuredImageAlt',
      defaultMessage: 'Mynd af konu við tölvu',
    },
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
    noResultsFound: {
      id: 'web.openinvoices:search.noResultsFound',
      defaultMessage: 'Engar færslur fundust',
    },
    filterSearch: {
      id: 'web.openinvoices:search.filterSearch',
      defaultMessage: 'Leita...',
    },
  }),
}
