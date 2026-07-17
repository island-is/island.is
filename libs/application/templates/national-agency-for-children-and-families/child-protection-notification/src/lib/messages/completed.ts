import { defineMessages } from 'react-intl'

export const completedMessages = defineMessages({
  sectionTitle: {
    id: 'cpn.application:completed.sectionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Completed section title in sidebar',
  },
  multiFieldTitle: {
    id: 'cpn.application:completed.multiFieldTitle',
    defaultMessage: 'Hvað gerist næst',
    description: 'Heading on the completed page',
  },
  alertTitle: {
    id: 'cpn.application:completed.alertTitle',
    defaultMessage:
      'Tilkynningin þín hefur nú verið send til barnarverndarþjónustu X',
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
      'Með tilkynningunni hjálparðu okkur að tryggja velferð barna.\n\nBarnaverndarþjónusta fær núna tilkynninguna senda til sín og metur upplýsingarnar sem þú sendir inn.\n\nÁður en afstaða er tekin í hvaða farveg málið fer kann að vera þörf á því að afla frekari gagna. Það er gert í þeim tilgangi að tryggja rétt viðbragð. Mun þá starfsmaður barnaverndar í því sveitarfélagi sem barnið á lögheimili setja sig í samband við þig, inna 7 daga frá því að tilkynningin er send.\n\nVið vekjum athygli á því að vegna trúnaðar við fjölskyldur er ekki hægt að veita upplýsingar um framvindu mála til þeirra sem tilkynna. Bent er þó á að hægt er að tilkynna að nýju ef aðstæður gefa tilefni til.\n\nÖll börn eiga rétt á öryggi, þau eiga alltaf að njóta vafans.',
    description: 'Body text on the completed page',
  },
  bottomButtonMessage: {
    id: 'cpn.application:completed.bottomButtonMessage',
    defaultMessage:
      'Á Mínum síðum Ísland.is getur þú nálgast stöðu tilkynningar ásamt öðrum upplýsingum',
    description: 'Bottom button message on the completed page',
  },
})
