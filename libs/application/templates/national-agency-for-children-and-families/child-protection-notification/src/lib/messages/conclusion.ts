import { defineMessages } from 'react-intl'

export const conclusionMessages = defineMessages({
  sectionTitle: {
    id: 'cpn.application:conclusion.sectionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Conclusion section title in sidebar',
  },
  multiFieldTitle: {
    id: 'cpn.application:conclusion.multiFieldTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Heading on the conclusion page',
  },
  alertTitle: {
    id: 'cpn.application:conclusion.alertTitle',
    defaultMessage:
      'Tilkynningin þín hefur verið send til barnarverndarþjónustu þar sem barnið hefur lögheimili eða hefur aðsetur',
    description: 'Success alert title on the conclusion page',
  },
  alertMessage: {
    id: 'cpn.application:conclusion.alertMessage',
    defaultMessage: 'Takk fyrir að bera hag barna fyrir brjósti',
    description: 'Success alert message on the conclusion page',
  },
  thankYouDescriptionAdultProcuration: {
    id: 'cpn.application:conclusion.thankYouDescriptionAdultProcuration',
    defaultMessage:
      'Starfsmaður barnaverndar mun hafa samband við tengilið þjónustuveitenda ef þörf er á frekari upplýsingum.\n\nVegna trúnaðar við fjölskyldur er ekki hægt að veita upplýsingar um framvindu mála til þeirra sem tilkynna. Bent er þó á að hægt er að tilkynna að nýju ef aðstæður gefa tilefni til.',
    description: 'Body text on the conclusion page',
  },
  thankYouDescriptionAdultPersonal: {
    // TODO: Update text for Adult Personal application
    id: 'cpn.application:conclusion.thankYouDescriptionAdultPersonal',
    defaultMessage: 'Adult Personal application - Text',
    description: 'Body text on the conclusion page',
  },
  thankYouDescriptionMinor: {
    // TODO: Update text for Minor application
    id: 'cpn.application:conclusion.thankYouDescriptionMinor',
    defaultMessage: 'Minor application - Text',
    description: 'Body text on the conclusion page',
  },
  bottomButtonMessage: {
    id: 'cpn.application:conclusion.bottomButtonMessage',
    defaultMessage:
      'Á Mínum síðum Ísland.is getur þú nálgast yfirlit yfir þínar tilkynningar ásamt öðrum upplýsingum',
    description: 'Bottom button message on the conclusion page',
  },
})
