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
    locationDescription: {
      id: 'id.application:priceList.labels.locationDescription',
      defaultMessage:
        'Fljótlegast er að sækja vegabréf hjá Þjóðskrá Íslands í Borgartúni 21, 105 Reykjavík. Á öðrum afhendingarstöðum getur afhending tekið allt að 6 til 10 daga. Sjá afgreiðslutíma.',
      description: 'Location select dropdown description',
    },
    locationPlaceholder: {
      id: 'id.application:priceList.labels.locationPlaceholder',
      defaultMessage: 'Veldu afhendingarstað',
      description: 'Location select dropdown placeholder',
    },
    regularPriceTitle: {
      id: 'id.application:priceList.labels.regularPriceTitle',
      defaultMessage: 'Almenn afgreiðsla: börn 4.600 kr.',
      description: 'Regular price radio button title',
    },
    regularPriceDescription: {
      id: 'id.application:priceList.labels.regularPriceDescription',
      defaultMessage: 'Innan 10 virkra daga frá myndatöku',
      description: 'Regular price radio button description',
    },
    fastPriceTitle: {
      id: 'id.application:priceList.labels.fastPriceTitle',
      defaultMessage: 'Hraðafgreiðsla:  börn, aldraðir, öryrkjar - 9.200 kr.',
      description: 'Fast price radio button title',
    },
    fastPriceDescription: {
      id: 'id.application:priceList.labels.fastPriceDescription',
      defaultMessage: 'Innan 2 virkra daga frá myndatöku',
      description: 'Fast price radio button description',
    },
  }),
}
