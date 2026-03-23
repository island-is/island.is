import { defineMessages } from 'react-intl'

export const priceList = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:priceList.general.sectionTitle',
      defaultMessage: 'Gjaldskrá',
      description: 'Price list section title',
    },
    description: {
      id: 'id.application:priceList.general.description',
      defaultMessage: 'Veldu þann afgreiðslumáta sem hentar þér best.',
      description: 'Price list page description',
    },
  }),
  labels: defineMessages({
    locationTitle: {
      id: 'id.application:priceList.labels.locationTitle',
      defaultMessage: 'Afhendingarstaður',
      description: 'Location select dropdown title',
    },
    regularPriceTitle: {
      id: 'id.application:priceList.labels.regularPriceTitle#markdown',
      defaultMessage: 'Almenn afgreiðsla: 18-66 ára - {price}',
      description: 'Regular price radio button title',
    },
    regularPriceDescription: {
      id: 'id.application:priceList.labels.regularPriceDescription',
      defaultMessage: 'Innan 10 virkra daga frá myndatöku',
      description: 'Regular price radio button description',
    },
    fastPriceTitle: {
      id: 'id.application:priceList.labels.fastPriceTitle#markdown',
      defaultMessage: 'Hraðafgreiðsla: 18-66 ára - {price}',
      description: 'Fast price radio button title',
    },
    fastPriceDescription: {
      id: 'id.application:priceList.labels.fastPriceDescription',
      defaultMessage: 'Innan 2 virkra daga frá myndatöku',
      description: 'Fast price radio button description',
    },
    discountRegularPriceTitle: {
      id: 'id.application:priceList.labels.discountRegularPriceTitle#markdown',
      defaultMessage: 'Almenn afgreiðsla: börn, aldraðir, öryrkjar - {price}',
      description: 'Discount Regular price radio button title',
    },
    discountFastPriceTitle: {
      id: 'id.application:priceList.labels.discountFastPriceTitle#markdown',
      defaultMessage: 'Hraðafgreiðsla:  börn, aldraðir, öryrkjar - {price}',
      description: 'Discount Fast price radio button title',
    },
  }),
}
