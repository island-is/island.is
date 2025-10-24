import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* Intro section */
  passport: {
    id: 'pa.application:passport',
    defaultMessage: 'Vegabréf',
    description: 'Some description',
  },
  introTitle: {
    id: 'pa.application:introTitle',
    defaultMessage: 'Inngangur',
    description: 'Some description',
  },
  introDescription: {
    id: 'pa.application:introDescription#markdown',
    defaultMessage: 'Í þessri umsókn...',
    description: 'Some description',
  },

  /* Data collection section */
  dataCollectionTitle: {
    id: 'pa.application:dataCollection.dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  dataCollectionSubtitle: {
    id: 'pa.application:dataCollection.dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionCheckboxLabel: {
    id: 'pa.application:dataCollection.dataCollectionCheckboxLabel',
    defaultMessage: 'Ég skil að ofangreind gögn verði sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionDistrictCommissionersTitle: {
    id: 'pa.application:dataCollection.dataCollectionDistrictCommissionersTitle',
    defaultMessage: 'Persónuupplýsingar úr Sýslumenn',
    description: 'Some description',
  },
  dataCollectionDistrictCommissionersSubitle: {
    id: 'pa.application:dataCollection.dataCollectionDistrictCommissionersSubitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Sýslumenn til þess að fylla út umsóknina.',
    description: 'Some description',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'pa.application:dataCollection.dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Some description',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'pa.application:dataCollection.dataCollectionNationalRegistrySubtitle',
    defaultMessage:
      'Upplýsingar frá Þjóðskrá um nafn, kennitölu og lögheimili.',
    description: 'Some description',
  },
  dataCollectionUserProfileTitle: {
    id: 'pa.application:dataCollection.dataCollectionUserProfileTitle',
    defaultMessage: 'Netfang og símanúmer',
    description: 'Some description',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'pa.application:dataCollection.dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Upplýsingar frá Mínum síðum á Ísland.is um netfang og símanúmer.',
    description: 'Some description',
  },
  dataCollectionIdentityDocumentTitle: {
    id: 'pa.application:dataCollection.dataCollectionIdentityDocumentTitle',
    defaultMessage: 'Skilríkjaskrá',
    description: 'Identity document provider title',
  },
  dataCollectionIdentityDocumentSubtitle: {
    id: 'pa.application:dataCollection.dataCollectionIdentityDocumentSubtitle',
    defaultMessage:
      'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár, ásamt börnum sem þú hefur forsjá yfir.',
    description: 'Identity document provider subtitle',
  },

  /* Select passport section */
  selectPassportSectionTitle: {
    id: 'pa.application:selectPassport.title',
    defaultMessage: 'Vegabréfin þín',
    description: 'Some description',
  },
  selectPassportSectionDescription: {
    id: 'pa.application:selectPassport.description#markdown',
    defaultMessage:
      'Þú getur sótt um nýtt vegabréf fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
    description: 'Some description',
  },
  passportNumber: {
    id: 'pa.application:selectPassport.passportNumber',
    defaultMessage: 'Vegabréfsnúmer:',
    description: 'Some description',
  },
  validTag: {
    id: 'pa.application:selectPassport.validTag',
    defaultMessage: 'Í gildi til',
    description: 'Some description',
  },
  noPassport: {
    id: 'pa.application:selectPassport.noPassport',
    defaultMessage: 'Vegabréf ekki til',
    description: 'Some description',
  },
  expiredTag: {
    id: 'pa.application:selectPassport.expiredTag',
    defaultMessage: 'Útrunnið',
    description: 'Some description',
  },
  incorrectDomicileTage: {
    id: 'pa.application:selectPassport.incorrectDomicileTage',
    defaultMessage: 'Rangt lögheimili',
    description: 'some description',
  },
  orderedTag: {
    id: 'pa.application:selectPassport.orderedTag',
    defaultMessage: 'Í pöntun',
    description: 'Some description',
  },
  children: {
    id: 'pa.application:selectPassport.childrenHeader',
    defaultMessage: 'Börn',
    description: 'Some description',
  },

  /* Information Section */
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
  hasDisabilityDiscount: {
    id: 'pa.application:personalInfo.hasDisabilityDiscount',
    defaultMessage:
      'Ég er handhafi örorkuskírteinis og vil láta fletta upp örorkuskírteini mínu hjá Tryggingastofnun fyrir lægra gjald á vegabréfi.',
    description: 'Some description',
  },
  noDisabilityRecordInfoMessage: {
    id: 'pa.application:noDisabilityRecordInfoMessage',
    defaultMessage: 'Þú ert ekki handhafi örorkuskírteinis',
    description: 'Some description',
  },
  disabilityRecordInfoMessage: {
    id: 'pa.application:disabilityRecordInfoMessage',
    defaultMessage: 'Þú ert handhafi örorkuskírteinis',
    description: 'Some description',
  },
  disabilityRecordError: {
    id: 'pa.application:disabilityRecordError',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að ná sambandi, vinsamlegast reyndu aftur síðar',
    description: 'Some description',
  },
  child: {
    id: 'pa.application:child',
    defaultMessage: 'Barn',
    description: 'Some description',
  },
  parent1: {
    id: 'pa.application:parent1',
    defaultMessage: 'Forsjáraðili 1',
    description: 'Some description',
  },
  parent2: {
    id: 'pa.application:parent2',
    defaultMessage: 'Forsjáraðili 2',
    description: 'Some description',
  },

  /* Service and delivery section */
  serviceTitle: {
    id: 'pa.application:service.title',
    defaultMessage: 'Gjaldskrá',
    description: 'Some description',
  },
  serviceTypeTitle: {
    id: 'pa.application:service.type.title',
    defaultMessage: 'Afhendingarmáti',
    description: 'Some description',
  },
  serviceTypeDescription: {
    id: 'pa.application:service.type.description',
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
    defaultMessage: 'Innan 10 virkra daga frá myndatöku',
    description: 'Some description',
  },
  serviceTypeRegularPrice: {
    id: 'pa.application:service.type.regular.price',
    defaultMessage: '14.000 kr.',
    description: 'Some description',
  },
  serviceTypeRegularPriceWithDiscount: {
    id: 'pa.application:service.type.regular.price.withDiscount',
    defaultMessage: '6.000kr',
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
    defaultMessage: '28.000 kr.',
    description: 'Some description',
  },
  serviceTypeExpressPriceWithDiscount: {
    id: 'pa.application:service.type.express.price.withDiscount',
    defaultMessage: '12.000 kr.',
    description: 'Some description',
  },

  /* Overview Section */
  overview: {
    id: 'pa.application:overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Some description',
  },
  overviewSectionTitle: {
    id: 'pa.application:overviewSection.title',
    defaultMessage: 'Yfirlit yfir umsókn',
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

  /* Payment Section */
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
  errorExpirationValidationTitle: {
    id: 'pa.application:error.expirationValidationTitle',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Error title when expiration validation fails',
  },
  errorExpirationValidationSummary: {
    id: 'pa.application:error.expirationValidationSummary',
    defaultMessage:
      'Ekki tókst að staðfesta að vegabréfið þitt renni út innan 6 mánaða',
    description: 'Error summary when expiration validation fails',
  },

  /* Waiting For Confirmation Section */
  waitingForConfirmationTitle: {
    id: 'pa.application:waitingForConfirmation.title',
    defaultMessage: 'Umsókn staðfest',
    description: 'Some description',
  },
  waitingForConfirmationDescription: {
    id: 'pa.application:waitingForConfirmation.description#markdown',
    defaultMessage:
      'Umsókn þín um vegabréf fyrir **{childsName}** hefur verið send til **{guardian2Name}** til samþykktar.',
    description: 'Some description',
  },

  /* ParentB Intro Section */
  parentBIntroText: {
    id: 'pa.application:parentBIntroText',
    defaultMessage:
      'Í þessu ferli samþykkir þú sem forsjáraðili umsókn **{guardianName}** um vegabréf fyrir **{childsName}**. Þegar þessi umsókn hefur verið samþykkt þarf viðkomandi að mæta í myndatöku hjá næsta sýslumanni til þess að vegabréfið geti farið í framleiðslu. Þegar vegabréfið er tilbúið verður hægt að sækja það hjá því sýslumannsembætti sem tilgreint var í umsóknarferlinu. Þetta ferli vistast sjálfkrafa á Mínar síður á Ísland.is. Þar getur þú einnig fylgst með stöðu umsóknar eftir að öll gögn hafa verið send inn.',
    description: 'Some description',
  },

  /* Done Section */
  actionCardDoneTag: {
    id: 'pa.application:actionCard.done',
    defaultMessage: 'Móttekin',
    description: 'Some description',
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
  applicationCompleteDescriptionText: {
    id: 'pa.application:complete.descriptionText',
    defaultMessage:
      'Umsókn þín um vegabréf fyrir **{name}** hefur verið móttekin.',
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
    defaultMessage: `* Fara í myndatöku á næsta afgreiðslustað sýslumanns.\\n\\n * Þú færð senda tilkynningu á Mínar síður þegar vegabréfið er tilbúið og hægt er að sækja það á þann afhendingarstað sem þú valdir.`,
    description: 'Some description',
  },
  applicationCompleteNextStepsDescriptionParentA: {
    id: 'pa.application:complete.nextSteps.descriptionParentA#markdown',
    defaultMessage: `* Þegar forsjáraðili hefur samþykkt umsóknina mun berast staðfesting í pósthólf ykkar á Ísland.is.\\n\\n * Forsjáraðili hefur viku til að bregðast við umsóknin.\\n\\n * Forsjáraðili skal mæta með einstaklingi í myndatöku á næsta afgreiðslustað sýslumanns og hafa meðferðis núgildandi vegabréf eða löggild skilríki með mynd sé vegabréfið glatað.\\n\\n * Tilkynning mun berast á Mínar síður á Ísland.is þegar vegabréfið er tilbúið auk upplýsinga um hvenær hægt verður að sækja það á þann afhendingarstað sem tilgreindur var í umsóknarferlinu.`,
    description: 'Some description',
  },
  applicationCompleteNextStepsDescriptionPersonalApplication: {
    id: 'pa.application:complete.nextSteps.descriptionPersonalApplication#markdown',
    defaultMessage: `* Fara í myndatöku á næsta afgreiðslustað sýslumanns.\\n\\n * Þú færð senda tilkynningu á Mínar síður þegar vegabréfið er tilbúið og hægt er að sækja það á þann afhendingarstað sem þú valdir.`,
    description: 'Some description',
  },

  /* History logs */
  waitingForConfirmationFromParentBTitle: {
    id: 'pa.application:history.waitingForConfirmationFromParentBTitle',
    defaultMessage: 'Staðfesting forsjáraðila',
    description: '',
  },
  waitingForConfirmationFromParentBDescription: {
    id: 'pa.application:history.waitingForConfirmationFromParentBDescription',
    defaultMessage: 'Beðið eftir staðfestingu forsjáraðila',
    description: '',
  },
  confirmedByParentB: {
    id: 'pa.application:history.confirmedByParentB',
    defaultMessage: 'Forsjáraðili hefur staðfest umsókn',
    description: '',
  },
})
