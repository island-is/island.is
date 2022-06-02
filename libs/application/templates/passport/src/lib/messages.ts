import { defineMessages } from 'react-intl'

export const m = defineMessages({
  dataCollectionTitle: {
    id: 'pp.application:dataCollection.title',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'pp.application:dataCollection.subtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Subtitle for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'pp.application:dataCollection.checkboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionDistrictCommissionersTitle: {
    id: 'pp.application:dataCollection.districtCommissionersTitle',
    defaultMessage: 'Persónuupplýsingar úr Sýslumenn',
    description: 'District commissioners title',
  },
  dataCollectionDistrictCommissionersSubitle: {
    id: 'pp.application:dataCollection.districtCommissionersSubitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Sýslumenn til þess að fylla út umsóknina.',
    description: 'District commissioners subtitle',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'pp.application:dataCollection.nationalRegistryTitle',
    defaultMessage: 'Upplýsingar úr skilríkjaskrá Þjóðskrár',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'pp.application:dataCollection.nationalRegistrySubtitle',
    defaultMessage:
      'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollection.userProfileTitle',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'pp.application:dataCollection.userProfileSubtitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum.',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  formName: {
    id: 'pp.application:form.name',
    defaultMessage: 'Umsókn um vegabréf',
    description: 'Passport Application',
  },
  infoTitle: {
    id: 'pp.application:personalInfo.infoTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Personal info title',
  },
  personalInfoSubtitle: {
    id: 'pp.application:personalInfo.personalInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir þínar upplýsingar og gakktu úr skugga um að þær séu réttar.',
    description: 'Personal info subtitle',
  },
  name: {
    id: 'pp.application:personalInfo.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'pp.application:personalInfo.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'pp.application:personalInfo.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  email: {
    id: 'pp.application:personalInfo.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  isCurrentPassportLost: {
    id: 'pp.application:personalInfo.isCurrentPassportLost',
    defaultMessage: 'Merktu hér ef vegabréfi hefur verið glatað',
    description: 'Some description',
  },
  serviceTitle: {
    id: 'pp.application:service.title',
    defaultMessage: 'Afhending',
    description: 'Some description',
  },
  serviceTypeTitle: {
    id: 'pp.application:service.typeTitle',
    defaultMessage: 'Afgreiðslumáti',
    description: 'Some description',
  },
  serviceType: {
    id: 'pp.application:service.type',
    defaultMessage: 'Veldu þann afgreiðslumáta sem hentar þér best.',
    description: 'Some description',
  },
  regularService: {
    id: 'pp.application:service.regular',
    defaultMessage: 'Almenn afhending - 13.000 kr.',
    description: 'Some description',
  },
  regularServiceSublabel: {
    id: 'pp.application:service.regular.sublabel',
    defaultMessage: 'Innan 10 virkra daga frá myndaöku.',
    description: 'Some description',
  },
  expressService: {
    id: 'pp.application:service.express',
    defaultMessage: 'Hraðafhending - 26.000 kr.',
    description: 'Some description',
  },
  expressServiceSublabel: {
    id: 'pp.application:service.express.sublabel',
    defaultMessage: 'Innan 2 virkra daga frá myndatöku',
    description: 'Some description',
  },
  dropLocation: {
    id: 'pp.application:service.dropLocation',
    defaultMessage: 'Afhendingarstaður',
    description: 'Some description',
  },
  dropLocationDescription: {
    id: 'pp.application:service.dropLocation',
    defaultMessage:
      'Fljótlegast er að sækja vegabréf hjá Þjóðskrá Íslands í Borgartúni 21, 105 Reykjavík. Á öðrum afhendingarstöðum getur afhending tekið allt að 6 - 10 daga.',
    description: 'Some description',
  },
  dropLocationPlaceholder: {
    id: 'pp.application:service.dropLocation.placeholder',
    defaultMessage: 'Veldu afhendingarstað',
    description: 'Some description',
  },
  dropLocationAuthentication: {
    id: 'pp.application:service.dropLocation.authentication',
    defaultMessage: 'Auðkenning við afhendingu',
    description: 'Some description',
  },
  dropLocationAuthenticationDescription: {
    id: 'pp.application:service.dropLocation.authenticationDescription',
    defaultMessage:
      'Veldu þau skilríki sem munu auðkenna þig við afhendingu á vegabréfi. Ef eldra vegabréf er glatað skaltu framvísa persónuskílríki með mynd - ökuskírteini eða nafnskírteini.',
    description: 'Some description',
  },
  noAuthenticationWarning: {
    id: 'pp.application:service.dropLocation.authentication.warning',
    defaultMessage:
      'Ef þú átt ekki löggild skilríki þarftu að mæta með tvo sjálfráða sannvotta með löggild skilríki til þess að auðkenna þig.',
    description: 'Some description',
  },
  overview: {
    id: 'pp.application:overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Some description',
  },
  overviewDescription: {
    id: 'pp.application:overview.description',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Some description',
  },
  currentPassportStatus: {
    id: 'pp.application:overview.currentPassport',
    defaultMessage: 'Staða núverandi vegabréfs',
    description: 'Some description',
  },
  authenticationType: {
    id: 'pp.application:overview.authenticationType',
    defaultMessage: 'Tegund skilríkja',
    description: 'Some description',
  },
  willBringPassport: {
    id: 'pp.application:overview.willBringPassport',
    defaultMessage: 'Ég mun mæta með núverandi vegabréf í myndatökuna.',
    description: 'Some description',
  },
  paymentSection: {
    id: 'pp.application:payment.section',
    defaultMessage: 'Staðfesting og greiðsla',
    description: 'Some description',
  },
  payment: {
    id: 'pp.application:payment',
    defaultMessage: 'Ganga frá greiðslu',
    description: 'Some description',
  },
  confirm: {
    id: 'pp.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'Some description',
  },
  errorDataProvider: {
    id: 'pp.application.system:core.error.dataProvider',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis við að sækja gögnin',
    description: 'Oops! Something went wrong when fetching your data',
  },
})
