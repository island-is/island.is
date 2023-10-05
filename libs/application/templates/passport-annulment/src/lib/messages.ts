import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* Intro section */
  introTitle: {
    id: 'paa.application:intro.title',
    defaultMessage: 'Inngangur',
    description: 'Some description',
  },

  /* Data collection section */
  dataCollectionTitle: {
    id: 'paa.application:dataCollection.dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  dataCollectionSubtitle: {
    id: 'paa.application:dataCollection.dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionCheckboxLabel: {
    id: 'paa.application:dataCollection.dataCollectionCheckboxLabel',
    defaultMessage: 'Ég skil að ofangreind gögn verði sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'paa.application:dataCollection.dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Some description',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'paa.application:dataCollection.dataCollectionNationalRegistrySubtitle',
    defaultMessage:
      'Upplýsingar frá Þjóðskrá um nafn, kennitölu og lögheimili.',
    description: 'Some description',
  },
  dataCollectionIdentityDocumentTitle: {
    id: 'cr.application:dataCollection.dataCollectionIdentityDocumentTitle',
    defaultMessage: 'Skilríkjaskrá',
    description: 'Identity document provider title',
  },
  dataCollectionIdentityDocumentSubtitle: {
    id: 'paa.application:dataCollection.dataCollectionIdentityDocumentSubtitle',
    defaultMessage:
      'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár, ásamt börnum sem þú hefur forsjá yfir.',
    description: 'Identity document provider subtitle',
  },

  /* Select passport section */
  selectPassportSectionTitle: {
    id: 'paa.application:selectPassport.title',
    defaultMessage: 'Vegabréfin þín',
    description: 'Some description',
  },
  selectPassportSectionDescription: {
    id: 'paa.application:selectPassport.description',
    defaultMessage:
      'Þú getur sótt um nýtt vegabréf fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
    description: 'Some description',
  },
  passportNumber: {
    id: 'paa.application:selectPassport.passportNumber',
    defaultMessage: 'Vegabréfsnúmer',
    description: 'Some description',
  },
  validTag: {
    id: 'paa.application:selectPassport.validTag',
    defaultMessage: 'Í gildi til ',
    description: 'Some description',
  },
  noPassport: {
    id: 'paa.application:selectPassport.noPassport',
    defaultMessage: 'Vegabréf ekki til',
    description: 'Some description',
  },
  expiredTag: {
    id: 'paa.application:selectPassport.expiredTag',
    defaultMessage: 'Útrunnið',
    description: 'Some description',
  },
  orderedTag: {
    id: 'paa.application:selectPassport.orderedTag',
    defaultMessage: 'Í pöntun',
    description: 'Some description',
  },
  children: {
    id: 'paa.application:selectPassport.childrenHeader',
    defaultMessage: 'Börn',
    description: 'Some description',
  },

  /* Information Section */
  formName: {
    id: 'paa.application:form.name',
    defaultMessage: 'Tilkynna glatað vegabréf',
    description: 'Some description',
  },
  infoTitle: {
    id: 'paa.application:personalInfo.infoTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  personalInfoSubtitle: {
    id: 'paa.application:personalInfo.personalInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir þínar upplýsingar og gakktu úr skugga um að þær séu réttar.',
    description: 'Some description',
  },
  name: {
    id: 'paa.application:personalInfo.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  infoText: {
    id: 'paa.application:personalInfo.infoText',
    defaultMessage: 'Glatað vegabréf',
    description: 'Some description',
  },
  infoTextDescription: {
    id: 'paa.application:personalInfo.infoTextDescription',
    defaultMessage:
      'Vegabréf sem tilkynnt eru glötuð eru skráð inn í Schengen og Interpol upplýsingakerfin og eru þar með ónothæf. Tilkynna skal lögreglu, Þjóðskrá Íslands eða sendimönnum Íslands erlendis þegar í stað ef vegabréf glatast, og gera sérstaka grein fyrir afdrifum þess.\n\n Einungis er hægt að tilkynna um sitt eigið vegabréf og þeirra barna sem tilkynnandi hefur forsjá yfir.',
    description: 'Some description',
  },
  statusTitle: {
    id: 'paa.application:personalInfo.statusTitle',
    defaultMessage: 'Hvað gerðist við vegabréfið',
    description: 'Some description',
  },
  statusLost: {
    id: 'paa.application:personalInfo.statusLost',
    defaultMessage: 'Týnt',
    description: 'Some description',
  },
  statusStolen: {
    id: 'paa.application:personalInfo.statusStolen',
    defaultMessage: 'Stolið',
    description: 'Some description',
  },
  commentTitle: {
    id: 'paa.application:personalInfo.commentTitle',
    defaultMessage: 'Hvað og hvenær glataðist vegabréfið',
    description: 'Some description',
  },
  commentPlaceholder: {
    id: 'paa.application:personalInfo.commentPlaceholder',
    defaultMessage: 'Lýstu hvar og hvernig vegabréfið glataðist',
    description: 'Some description',
  },

  /* Overview Section */
  overview: {
    id: 'paa.application:overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Some description',
  },
  overviewSectionTitle: {
    id: 'paa.application:overviewSection.title',
    defaultMessage: 'Yfirlit yfir umsókn',
    description: 'Some description',
  },
  overviewDescription: {
    id: 'paa.application:overview.description',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Some description',
  },
  currentPassportStatus: {
    id: 'paa.application:overview.currentPassport',
    defaultMessage: 'Staða núverandi vegabréfs',
    description: 'Some description',
  },
  currentPassportExpiration: {
    id: 'paa.application:overview.currentPassport.expiration',
    defaultMessage: 'Í gildi til',
    description: 'Some description',
  },
  authenticationType: {
    id: 'paa.application:overview.authenticationType',
    defaultMessage: 'Tegund skilríkja',
    description: 'Some description',
  },
  willBringPassport: {
    id: 'paa.application:overview.willBringPassport',
    defaultMessage: 'Ég mun mæta með núverandi vegabréf í myndatökuna.',
    description: 'Some description',
  },
  submitApplication: {
    id: 'paa.application:submitApplication',
    defaultMessage: 'Staðfesta',
    description: 'Some description',
  },

  /* Done Section */
  actionCardDoneTag: {
    id: 'paa.application:actionCard.done',
    defaultMessage: 'Móttekin',
    description: 'Some description',
  },
  applicationCompleteTitle: {
    id: 'paa.application:complete.title',
    defaultMessage: 'Til greiðslu',
    description: 'Some description',
  },
  applicationCompletePassport: {
    id: 'paa.application:complete.passport',
    defaultMessage: 'Vegabréf',
    description: 'Some description',
  },
  applicationCompleteTotal: {
    id: 'paa.application:complete.total',
    defaultMessage: 'Samtals',
    description: 'Some description',
  },
  applicationComplete: {
    id: 'paa.application:complete',
    defaultMessage: 'Tilkynning móttekin',
    description: 'Some description',
  },
  applicationCompleteDescriptionText: {
    id: 'paa.application:complete.descriptionText',
    defaultMessage:
      'Tilkynning um glatað vegabréf fyrir **{name}** hefur verið móttekin.',
    description: 'Some description',
  },
})
