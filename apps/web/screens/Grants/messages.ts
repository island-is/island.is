import { defineMessages } from 'react-intl'

export const m = {
  general: defineMessages({
    seeMore: {
      id: 'web.grants:general.seeMore',
      defaultMessage: 'Skoða nánar',
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
      defaultMessage: 'Leitarniðurstöður',
    },
    inputPlaceholder: {
      id: 'web.grants:search.inputPlaceholder',
      defaultMessage: 'Sía eftir leitarorði',
    },
    clearFilters: {
      id: 'web.grants:search.clearFilters',
      defaultMessage: 'Hreinsa allar síur',
    },
    clearFilterCategory: {
      id: 'web.grants:search.clearFilterCategory',
      defaultMessage: 'Hreinsa flokk',
    },
    applicationStatus: {
      id: 'web.grants:search.applicationStatus',
      defaultMessage: 'Staða umsóknar',
    },
    category: {
      id: 'web.grants:search.category',
      defaultMessage: 'Flokkun',
    },
    type: {
      id: 'web.grants:search.type',
      defaultMessage: 'Tegund',
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
    deadline: {
      id: 'web.grants:single.deadline',
      defaultMessage: 'Umsóknarfrestur',
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
  }),
}
