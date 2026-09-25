import { defineMessages } from 'react-intl'

export const completedMessages = defineMessages({
  sectionTitle: {
    id: 'cpn.application:completed.sectionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Completed section title in sidebar',
  },
  multiFieldTitle: {
    id: 'cpn.application:completed.multiFieldTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Heading on the completed page',
  },
  alertTitle: {
    id: 'cpn.application:completed.alertTitle',
    defaultMessage:
      'Tilkynningin þín hefur verið send til barnarverndarþjónustu þar sem barnið hefur lögheimili eða hefur aðsetur',
    description: 'Success alert title on the completed page',
  },
  alertMessage: {
    id: 'cpn.application:completed.alertMessage',
    defaultMessage: 'Takk fyrir að bera hag barna fyrir brjósti',
    description: 'Success alert message on the completed page',
  },
  thankYouDescription: {
    id: 'cpn.application:completed.thankYouDescription',
    defaultMessage:
      'Starfsmaður barnaverndar mun hafa samband við tengilið þjónustuveitenda, innan 7 daga, ef þörf er á frekari upplýsingum.\n\nVegna trúnaðar við fjölskyldur er ekki hægt að veita upplýsingar um framvindu mála til þeirra sem tilkynna. Bent er þó á að hægt er að tilkynna að nýju ef aðstæður gefa tilefni til.',
    description: 'Body text on the completed page',
  },
  bottomButtonMessage: {
    id: 'cpn.application:completed.bottomButtonMessage',
    defaultMessage:
      'Á Mínum síðum Ísland.is getur þú nálgast yfirlit yfir þínar tilkynningar ásamt öðrum upplýsingum',
    description: 'Bottom button message on the completed page',
  },
})
