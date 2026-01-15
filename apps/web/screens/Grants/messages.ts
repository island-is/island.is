import { defineMessages } from 'react-intl'

export const m = {
  general: defineMessages({
    seeMore: {
      id: 'web.grants:general.seeMore',
      defaultMessage: 'Skoða nánar',
    },
    goBack: {
      id: 'web.grants:general.goBack',
      defaultMessage: 'Til baka',
    },
    displayGrid: {
      id: 'web.grants:general.displayGrid',
      defaultMessage: 'Sýna sem spjöld',
    },
    displayList: {
      id: 'web.grants:general.displayList',
      defaultMessage: 'Sýna sem lista',
    },
  }),
  search: defineMessages({
    search: {
      id: 'web.grants:search.search',
      defaultMessage: 'Leit',
    },
    description: {
      id: 'web.grants:search.description',
      defaultMessage: 'Lýsing',
    },
    results: {
      id: 'web.grants:search.results',
      defaultMessage: 'Styrkir',
    },
    inputPlaceholder: {
      id: 'web.grants:search.inputPlaceholder',
      defaultMessage: 'Sía eftir leitarorði',
    },
    filterTitle: {
      id: 'web.grants:search.filterTitle',
      defaultMessage: 'Leitarsíur',
    },
    clearFilters: {
      id: 'web.grants:search.clearFilters',
      defaultMessage: 'Hreinsa allar síur',
    },
    openFilter: {
      id: 'web.grants:search.openFilter',
      defaultMessage: 'Opna síu',
    },
    closeFilter: {
      id: 'web.grants:search.closeFilter',
      defaultMessage: 'Loka síu',
    },
    clearFilterCategory: {
      id: 'web.grants:search.clearFilterCategory',
      defaultMessage: 'Hreinsa síu',
    },
    applicationStatus: {
      id: 'web.grants:search.applicationStatus',
      defaultMessage: 'Staða umsókna',
    },
    applicationOpen: {
      id: 'web.grants:search.applicationOpen',
      defaultMessage: 'Opið fyrir umsóknir',
    },
    applicationClosed: {
      id: 'web.grants:search.applicationClosed',
      defaultMessage: 'Lokað fyrir umsóknir',
    },
    applicationOpensSoon: {
      id: 'web.grants:search.applicationOpensSoon',
      defaultMessage: 'Opnar fljótlega',
    },
    applicationSeeDescription: {
      id: 'web.grants:search.applicationSeeDescription',
      defaultMessage: 'Sjá lýsingu',
    },
    applicationOpensAt: {
      id: 'web.grants:search.applicationOpensAt',
      defaultMessage: 'Opnar {arg}',
    },
    applicationEstimatedOpensAt: {
      id: 'web.grants:search.applicationEstimatedOpensAt',
      defaultMessage: 'Áætlað næst í {arg}',
    },
    applicationOpensTo: {
      id: 'web.grants:search.applicationOpensTo',
      defaultMessage: 'Frestur til {arg}',
    },
    applicationOpensToWithDay: {
      id: 'web.grants:search.applicationOpensToWithDay',
      defaultMessage: 'Frestur til og með {arg}',
    },
    applicationWasOpenTo: {
      id: 'web.grants:search.applicationWasOpenTo',
      defaultMessage: 'Frestur var til {arg}',
    },
    applicationWasOpenToAndWith: {
      id: 'web.grants:search.applicationWasOpenToAndWith',
      defaultMessage: 'Frestur var til {arg}',
    },
    applicationAlwaysOpen: {
      id: 'web.grants:search.applicationAlwaysOpen',
      defaultMessage: 'Opið er allt árið',
    },
    category: {
      id: 'web.grants:search.category',
      defaultMessage: 'Flokkun',
    },
    type: {
      id: 'web.grants:search.type',
      defaultMessage: 'Tegund',
    },
    viewResults: {
      id: 'web.grants:search.viewResults',
      defaultMessage: 'Skoða niðurstöður',
    },
    resultFound: {
      id: 'web.grants:search.resultFound',
      defaultMessage: '{arg} styrkur fannst',
    },
    resultsFound: {
      id: 'web.grants:search.resultsFound',
      defaultMessage: '{arg} styrkir fundust',
    },
    noResultsFound: {
      id: 'web.grants:search.noResultsFound',
      defaultMessage: 'Engir styrkir fundust',
    },
    error: {
      id: 'web.grants:search.error',
      defaultMessage: 'Þjónusta liggur tímabundið niðri',
    },
    errorText: {
      id: 'web.grants:search.errorText',
      defaultMessage: 'Vinsamlegast reynið aftur síðar',
    },
    organization: {
      id: 'web.grants:search.organization',
      defaultMessage: 'Stofnun',
    },
  }),
  single: defineMessages({
    fund: {
      id: 'web.grants:single.fund',
      defaultMessage: 'Sjóður',
    },
    category: {
      id: 'web.grants:single.category',
      defaultMessage: 'Styrkjaflokkun',
    },
    provider: {
      id: 'web.grants:single.provider',
      defaultMessage: 'Þjónustuaðili',
    },
    unknownInstitution: {
      id: 'web.grants:single.unknownInstitution',
      defaultMessage: 'Óþekkt stofnun',
    },
    type: {
      id: 'web.grants:single.type',
      defaultMessage: 'Tegund',
    },
    applications: {
      id: 'web.grants:single.applications',
      defaultMessage: 'Umsóknir',
    },
    deadline: {
      id: 'web.grants:single.deadline',
      defaultMessage: 'Umsóknir',
    },
    deadlinePeriod: {
      id: 'web.grants:single.deadlinePeriod',
      defaultMessage: 'Umsóknartímabil',
    },
    status: {
      id: 'web.grants:single.status',
      defaultMessage: 'Staða',
    },
    whatIsGranted: {
      id: 'web.grants:single.whatIsGranted',
      defaultMessage: 'Hvað er styrkt?',
    },
    specialEmphasis: {
      id: 'web.grants:single.specialEmphasis',
      defaultMessage: 'Sérstakar áherslur',
    },
    whoCanApply: {
      id: 'web.grants:single.whoCanApply',
      defaultMessage: 'Hverjir geta sótt um?',
    },
    apply: {
      id: 'web.grants:single.apply',
      defaultMessage: 'Sækja um',
    },
    howToApply: {
      id: 'web.grants:single.howToApply',
      defaultMessage: 'Hvernig er sótt um?',
    },
    answeringQuestions: {
      id: 'web.grants:single.answeringQuestions',
      defaultMessage: 'Svör við spurningum',
    },
  }),
  home: defineMessages({
    title: {
      id: 'web.grants:home.title',
      defaultMessage: 'Styrkjatorg',
    },
    grant: {
      id: 'web.grants:home.gramt',
      defaultMessage: 'Styrkur',
    },
    description: {
      id: 'web.grants:home.description',
      defaultMessage: 'Styrkjatorg lýsing  .....',
    },
    featuredImage: {
      id: 'web.grants:home.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
    },
    featuredImageAlt: {
      id: 'web.grants:home.featuredImageAlt',
      defaultMessage: 'Mynd af konu við tölvu',
    },
    searchResultsImage: {
      id: 'web.grants:home.searchResultsImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
    },
    searchResultsImageAlt: {
      id: 'web.grants:home.searchResultsImageAlt',
      defaultMessage: 'Mynd af klemmuspjaldi ásamt blýanti',
    },
    inputPlaceholder: {
      id: 'web.grants:home.inputPlaceholder',
      defaultMessage: 'Leitaðu á styrkjatorgi',
    },
    mostVisited: {
      id: 'web.grants:home.mostVisited',
      defaultMessage: 'Mest sótt',
    },
    popularCategories: {
      id: 'web.grants:home.popularCategories',
      defaultMessage: 'Vinsælir flokkar',
    },
    allGrants: {
      id: 'web.grants:home.allGrants',
      defaultMessage: 'Allir styrkir',
    },
    grantCategoryYouthAndSportsDescription: {
      id: 'web.grants:home.grantCategoryYouthAndSportsDescription',
      defaultMessage: 'Lýsing á æskulýðsstarfi og íþróttum',
    },
    grantCategoryEducationAndTeachingDescription: {
      id: 'web.grants:home.grantCategoryEducationAndTeachingDescription',
      defaultMessage: 'Lýsing á námi og kennslu',
    },
    grantCategoryProfessionalEducationDescription: {
      id: 'web.grants:home.grantCategoryProfessionalEducationDescription',
      defaultMessage: 'Lýsing á starfs- og símenntun',
    },
    grantCategoryGlobalDescription: {
      id: 'web.grants:home.grantCategoryGlobalDescription',
      defaultMessage: 'Lýsing á alþjóðlegum',
    },
    grantCategoryInnovationDescription: {
      id: 'web.grants:home.grantCategoryInnovationDescription',
      defaultMessage: 'Lýsing á nýsköpun',
    },
    grantCategoryResearchDescription: {
      id: 'web.grants:home.grantCategoryResearchDescription',
      defaultMessage: 'Lýsing á rannsóknum',
    },
    grantCategoryNativeDescription: {
      id: 'web.grants:home.grantCategoryNativeDescription',
      defaultMessage: 'Lýsing á innlendu',
    },
    grantCategoryCultureAndArtsDescription: {
      id: 'web.grants:home.grantCategoryCultureAndArtsDescription',
      defaultMessage: 'Lýsing á menningu og list',
    },
    grantCategoryBusinessDescription: {
      id: 'web.grants:home.grantCategoryBusinessDescription',
      defaultMessage: 'Lýsing á atvinnulífi',
    },
    grantCategoryEnergyTransitionDescription: {
      id: 'web.grants:home.grantCategoryEnergyTransitionDescription',
      defaultMessage: 'Lýsing á orkuskiptum',
    },
    grantCategoryEnvironmentDescription: {
      id: 'web.grants:home.grantCategoryEnvironmentDescription',
      defaultMessage: 'Lýsing á umhverfi',
    },
  }),
  bullets: defineMessages({
    open: {
      id: 'web.grants:bullets.open',
      defaultMessage: 'Opið fyrir umsóknir',
    },
    nativeFunds: {
      id: 'web.grants:bullets.nativeFunds',
      defaultMessage: 'Innlendir sjóðir',
    },
    technologyDevelopmentFund: {
      id: 'web.grants:bullets.technologyDevelopmentFund',
      defaultMessage: 'Tækniþróunarsjóður',
    },
    technologyDevelopment: {
      id: 'web.grants:bullets.technologyDevelopment',
      defaultMessage: 'Tækniþróunar',
    },
    financing: {
      id: 'web.grants:bullets.financing',
      defaultMessage: 'Fjármögnun',
    },
    companies: {
      id: 'web.grants:bullets.companies',
      defaultMessage: 'Fyrirtæki',
    },
  }),
}
