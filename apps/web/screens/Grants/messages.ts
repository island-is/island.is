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
    inputPlaceholder: {
      id: 'web.grants:search.inputPlaceholder',
      defaultMessage: 'Sía eftir leitarorði',
    },
    applicationStatus: {
      id: 'web.grants:search.applicationStatus',
      defaultMessage: 'Staða umsóknar',
    },
    category: {
      id: 'web.grants:search.category',
      defaultMessage: 'Flokkur',
    },
    type: {
      id: 'web.grants:search.type',
      defaultMessage: 'Tegund',
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
      defaultMessage: 'Styrkjaflokkur',
    },
    provider: {
      id: 'web.grants:single.provider',
      defaultMessage: 'Þjónustuaðili',
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
    description: {
      id: 'web.grants:home.description',
      defaultMessage: 'Styrkjatorg lýsing  .....',
    },
    featuredImage: {
      id: 'web.grants:home.featuredImage',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
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
