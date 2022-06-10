import { defineMessages } from 'react-intl'

export const m = defineMessages({
  dataCollectionTitle: {
    id: 'pa.application:dataCollection.title',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  dataCollectionSubtitle: {
    id: 'pa.application:dataCollection.subtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionCheckboxLabel: {
    id: 'pa.application:dataCollection.checkboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Some description',
  },
  dataCollectionDistrictCommissionersTitle: {
    id: 'pa.application:dataCollection.districtCommissionersTitle',
    defaultMessage: 'Persónuupplýsingar úr Sýslumenn',
    description: 'Some description',
  },
  dataCollectionDistrictCommissionersSubitle: {
    id: 'pa.application:dataCollection.districtCommissionersSubitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Sýslumenn til þess að fylla út umsóknina.',
    description: 'Some description',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'pa.application:dataCollection.nationalRegistryTitle',
    defaultMessage: 'Upplýsingar úr skilríkjaskrá Þjóðskrár',
    description: 'Some description',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'pa.application:dataCollection.nationalRegistrySubtitle',
    defaultMessage:
      'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár.',
    description: 'Some description',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollection.userProfileTitle',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Some description',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'pa.application:dataCollection.userProfileSubtitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
    description: 'Some description',
  },
  dataCollectionIdentityDocumentTitle: {
    id: 'cr.application:dataCollection.identityDocumentTitle',
    defaultMessage: 'Skilríkjaskrá',
    description: 'Identity document provider title',
  },
  dataCollectionIdentityDocumentSubtitle: {
    id: 'pa.application:dataCollection.identityDocumentSubtitle',
    defaultMessage: 'Upplýsingar frá skilríkjaskrá hjá Þjóðskrá.',
    description: 'Identity document provider subtitle',
  },
  formName: {
    id: 'pa.application:form.name',
    defaultMessage: 'Umsókn um vegabréf',
    description: 'Some description',
  },
  infoTitle: {
    id: 'pa.application:personalInfo.infoTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  personalInfoSubtitle: {
    id: 'pa.application:personalInfo.personalInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir þínar upplýsingar og gakktu úr skugga um að þær séu réttar.',
    description: 'Some description',
  },
  name: {
    id: 'pa.application:personalInfo.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'pa.application:personalInfo.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'pa.application:personalInfo.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  email: {
    id: 'pa.application:personalInfo.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  isCurrentPassportLost: {
    id: 'pa.application:personalInfo.isCurrentPassportLost',
    defaultMessage: 'Merktu hér ef vegabréfi hefur verið glatað',
    description: 'Some description',
  },
  serviceTitle: {
    id: 'pa.application:service.title',
    defaultMessage: 'Afhending',
    description: 'Some description',
  },
  serviceTypeTitle: {
    id: 'pa.application:service.typeTitle',
    defaultMessage: 'Afgreiðslumáti',
    description: 'Some description',
  },
  serviceType: {
    id: 'pa.application:service.type',
    defaultMessage: 'Veldu þann afgreiðslumáta sem hentar þér best.',
    description: 'Some description',
  },
  serviceTypeRegular: {
    id: 'pa.application:service.type.regular',
    defaultMessage: 'Almenn afhending',
    description: 'Some description',
  },
  serviceTypeRegularSublabel: {
    id: 'pa.application:service.regular.sublabel',
    defaultMessage: 'Innan 10 virkra daga frá myndaöku.',
    description: 'Some description',
  },
  serviceTypeRegularPrice: {
    id: 'pa.application:service.type.regular.price',
    defaultMessage: '13.000 kr.',
    description: 'Some description',
  },
  serviceTypeExpress: {
    id: 'pa.application:service.type.express',
    defaultMessage: 'Hraðafhending',
    description: 'Some description',
  },
  serviceTypeExpressSublabel: {
    id: 'pa.application:service.express.sublabel',
    defaultMessage: 'Innan 2 virkra daga frá myndatöku',
    description: 'Some description',
  },
  serviceTypeExpressPrice: {
    id: 'pa.application:service.type.express.price',
    defaultMessage: '26.000 kr.',
    description: 'Some description',
  },
  dropLocation: {
    id: 'pa.application:service.dropLocation',
    defaultMessage: 'Afhendingarstaður',
    description: 'Some description',
  },
  dropLocationDescription: {
    id: 'pa.application:service.dropLocation.description',
    defaultMessage:
      'Fljótlegast er að sækja vegabréf hjá Þjóðskrá Íslands í Borgartúni 21, 105 Reykjavík. Á öðrum afhendingarstöðum getur afhending tekið allt að 6 - 10 daga.',
    description: 'Some description',
  },
  dropLocationPlaceholder: {
    id: 'pa.application:service.dropLocation.placeholder',
    defaultMessage: 'Veldu afhendingarstað',
    description: 'Some description',
  },
  dropLocationAuthentication: {
    id: 'pa.application:service.dropLocation.authentication',
    defaultMessage: 'Auðkenning við afhendingu',
    description: 'Some description',
  },
  dropLocationAuthenticationDescription: {
    id: 'pa.application:service.dropLocation.authentication.description',
    defaultMessage:
      'Veldu þau skilríki sem munu auðkenna þig við afhendingu á vegabréfi. Ef eldra vegabréf er glatað skaltu framvísa persónuskílríki með mynd - ökuskírteini eða nafnskírteini.',
    description: 'Some description',
  },
  noAuthenticationWarning: {
    id: 'pa.application:service.dropLocation.authentication.warning',
    defaultMessage:
      'Ef þú átt ekki löggild skilríki þarftu að mæta með tvo sjálfráða sannvotta með löggild skilríki til þess að auðkenna þig.',
    description: 'Some description',
  },
  overview: {
    id: 'pa.application:overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Some description',
  },
  overviewDescription: {
    id: 'pa.application:overview.description',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Some description',
  },
  currentPassportStatus: {
    id: 'pa.application:overview.currentPassport',
    defaultMessage: 'Staða núverandi vegabréfs',
    description: 'Some description',
  },
  authenticationType: {
    id: 'pa.application:overview.authenticationType',
    defaultMessage: 'Tegund skilríkja',
    description: 'Some description',
  },
  willBringPassport: {
    id: 'pa.application:overview.willBringPassport',
    defaultMessage: 'Ég mun mæta með núverandi vegabréf í myndatökuna.',
    description: 'Some description',
  },
  proceedToPayment: {
    id: 'pa.application:payment.proceedToPayment',
    defaultMessage: 'Greiða',
    description: 'Some description',
  },
  paymentSection: {
    id: 'pa.application:payment.section',
    defaultMessage: 'Staðfesting og greiðsla',
    description: 'Some description',
  },
  paymentSectionTitle: {
    id: 'pa.application:payment.section.title',
    defaultMessage: 'Greiðsla',
    description: 'Some description',
  },
  payment: {
    id: 'pa.application:payment',
    defaultMessage: 'Ganga frá greiðslu',
    description: 'Some description',
  },
  confirm: {
    id: 'pa.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'Some description',
  },
  errorDataProvider: {
    id: 'pa.application:error.dataProvider',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis við að sækja gögnin',
    description: 'Oops! Something went wrong when fetching your data',
  },
  applicationCompleteTitle: {
    id: 'pa.application:complete.title',
    defaultMessage: 'Til greiðslu',
    description: 'Some description',
  },
  applicationCompletePassport: {
    id: 'pa.application:complete.passport',
    defaultMessage: 'Vegabréf',
    description: 'Some description',
  },
  applicationCompleteTotal: {
    id: 'pa.application:complete.total',
    defaultMessage: 'Samtals',
    description: 'Some description',
  },
  applicationComplete: {
    id: 'pa.application:complete',
    defaultMessage: 'Umsókn staðfest',
    description: 'Some description',
  },
  applicationCompleteDescription: {
    id: 'pa.application:complete.description',
    defaultMessage: 'Umsókn þín um vegabréf hefur verið móttekin.',
    description: 'Some description',
  },
  applicationCompleteNumber: {
    id: 'pa.application:complete.number',
    defaultMessage: 'Númer umsóknar',
    description: 'Some description',
  },
  applicationCompleteNextSteps: {
    id: 'pa.application:complete.nextSteps',
    defaultMessage: 'Næstu skref',
    description: 'Some description',
  },
  applicationCompleteNextStepsDescription: {
    id: 'pa.application:complete.nextSteps.description#markdown',
    defaultMessage: `* Fara í myndatöku á næsta afgreiðslustað sýslumanns.\\n\\n
    * Þú færð senda tilkynningu á Mínar síður þegar vegabréfið er tilbúið og hægt er að sækja það á þann afhendingarstað sem þú valdir.`,
    description: 'Some description',
  },
})
