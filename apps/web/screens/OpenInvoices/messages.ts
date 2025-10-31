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
}
