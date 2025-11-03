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
    searchTitle: {
      id: 'web.openinvoices:overview.searchTitle',
      defaultMessage: 'Leit og síun',
    },
    searchInputPlaceholder: {
      id: 'web.openinvoices:overview.searchInputPlaceholder',
      defaultMessage: 'Leita í reikningum',
    }
  }),
}
